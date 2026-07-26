import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { scrapePlayStore } from '@/lib/scrapers/playStore';
import { scrapeAppStore } from '@/lib/scrapers/appStore';
import { scrapeWebsite } from '@/lib/scrapers/website';
import { adminDb, adminAuth } from '@/utils/firebaseAdmin';
import { buildQuickRoastPrompt } from '@/lib/prompts/quickRoast';
import { buildDeepRoastPrompt } from '@/lib/prompts/deepRoast';

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1'));
    const authHeader = req.headers.get('authorization');
    let user = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        if (adminAuth) {
          const decodedToken = await adminAuth.verifyIdToken(token);
          user = decodedToken;
        }
      } catch (err) {
        console.error("Invalid Firebase token", err);
      }
    }

    let isPaidRoast = false;

    // Authenticated User -> Check Credits
    if (user && adminDb) {
      const docRef = adminDb.collection('profiles').doc(user.uid);
      const docSnap = await docRef.get();
      const profile = docSnap.exists ? docSnap.data() : null;

      if (profile && profile.credits > 0) {
        isPaidRoast = true;
      }
    }

    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    let appData;
    
    if (url.includes('play.google.com')) {
      const appIdMatch = url.match(/id=([a-zA-Z0-9._]+)/);
      if (!appIdMatch) return NextResponse.json({ error: 'Invalid Play Store URL' }, { status: 400 });
      appData = await scrapePlayStore(appIdMatch[1]);
    } 
    else if (url.includes('apps.apple.com')) {
      const appIdMatch = url.match(/id(\d+)/);
      if (!appIdMatch) return NextResponse.json({ error: 'Invalid App Store URL' }, { status: 400 });
      appData = await scrapeAppStore(appIdMatch[1]);
    } 
    else {
      appData = await scrapeWebsite(url);
    }

    const isWebsite = appData.type === 'website';
    
    const promptText = isPaidRoast 
      ? buildDeepRoastPrompt(appData, isWebsite)
      : buildQuickRoastPrompt(appData, isWebsite);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.85,
        topP: 0.95
      } 
    });
    
    const parts: any[] = [{ text: promptText }];
    
    // ONLY send screenshots if it's a paid deep roast to save massive token costs
    if (isPaidRoast && 'screenshots' in appData && Array.isArray(appData.screenshots)) {
      for (const imgUrl of appData.screenshots) {
        try {
          const imgRes = await fetch(imgUrl);
          const arrayBuffer = await imgRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          parts.push({
            inlineData: {
              data: base64,
              mimeType: 'image/jpeg'
            }
          });
        } catch (e) {
          console.error("Failed to load screenshot for AI", imgUrl);
        }
      }
    }

    const result = await model.generateContent(parts);
    const roastText = result.response.text();
    const roastJson = JSON.parse(roastText);

    // Charge the user if they had credits
    if (isPaidRoast && adminDb && user) {
      const docRef = adminDb.collection('profiles').doc(user.uid);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const profile = docSnap.data();
        if (profile && profile.credits > 0) {
          await docRef.update({ credits: profile.credits - 1 });
        }
      }
    }

    const screenshots = ('screenshots' in appData ? appData.screenshots : []) || [];
    
    // Save report to Firestore
    const roastDoc = {
      type: appData.type,
      url: url,
      screenshots: screenshots,
      roastData: roastJson,
      isPaid: isPaidRoast,
      createdAt: new Date().toISOString(),
      userId: user ? user.uid : null,
      ip: user ? null : ip
    };
    
    let reportId = null;
    if (adminDb) {
      const docRef = await adminDb.collection('reports').add(roastDoc);
      reportId = docRef.id;
    }

    return NextResponse.json({ success: true, reportId, data: roastJson, type: appData.type, screenshots });

  } catch (error: any) {
    console.error("API Error:", error);
    const lowerMsg = (error?.message || '').toLowerCase();
    
    // Always return a friendly message to the user, never a raw AI error stack trace.
    let message = "Whoops! Our AI got a little stage fright. Give it a minute and try again.";
    
    if (lowerMsg.includes('503') || lowerMsg.includes('high demand') || lowerMsg.includes('unavailable')) {
      message = "The AI is currently facing very high demand. Please try again in a few seconds!";
    } else if (lowerMsg.includes('429') || lowerMsg.includes('quota') || lowerMsg.includes('too many requests') || lowerMsg.includes('rate limit')) {
      message = "Whoa there! The AI is getting way too much attention right now. Give it a minute to catch its breath and try again.";
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

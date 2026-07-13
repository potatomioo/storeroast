import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { scrapePlayStore } from '@/lib/scrapers/playStore';
import { scrapeAppStore } from '@/lib/scrapers/appStore';
import { scrapeWebsite } from '@/lib/scrapers/website';
import { Redis } from '@upstash/redis';
import { adminDb, adminAuth } from '@/utils/firebaseAdmin';

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP Tracking & Authentication
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = req.ip || (forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1'));
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

    if (!user) {
      // Anonymous User -> Check Upstash limit by IP
      const tries = (await redis.get<number>(`tries:${ip}`)) || 0;
      if (tries >= 2) {
        return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 });
      }
    } else {
      // Authenticated User -> Check Credits
      if (adminDb) {
        const docRef = adminDb.collection('profiles').doc(user.uid);
        const docSnap = await docRef.get();
        const profile = docSnap.exists ? docSnap.data() : null;

        if (profile && profile.credits > 0) {
          isPaidRoast = true;
        } else {
          // Logged in but out of credits -> Give them 2 free tries tied to their UID
          const tries = (await redis.get<number>(`tries:${user.uid}`)) || 0;
          if (tries >= 2) {
            return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 });
          }
        }
      } else {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
      }
    }

    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    let appData;
    
    // Detect URL Type
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
      // Treat as website
      appData = await scrapeWebsite(url);
    }

    const savagePrompt = `You are a savage, dark-humored app critic who roasts apps like a comedian roasting a celebrity at an awards show. Think: Gordon Ramsay meets a tech influencer.

RULES — STRICTLY FOLLOW:
1. NO CORPORATE LANGUAGE. Zero. Never say "consider improving" or "it would be beneficial". 
2. REFERENCE THEIR EXACT WORDS. Use their actual description phrases and mock them specifically.
3. DARK HUMOR ONLY. Make it sting but laugh-worthy.
4. SHORT AND PUNCHY. Max 2 sentences per roast. No essays.
5. THE FIX should be sarcastic too — not boring advice.
6. BETTER STUDENT: Pick a real, famous, top-performing app in their exact category (e.g., Robinhood for Finance, Tinder for Dating). Compare their listing (ASO, screenshots, copy) to this app's listing to show why the famous app converts better. Focus ONLY on marketing/ASO, not app features.

BAD ROAST EXAMPLE (DO NOT DO THIS):
"Your description could be more concise and focused on key benefits."

GOOD ROAST EXAMPLE (DO THIS):
"Your description reads like someone asked ChatGPT to write it at 3am and then forgot to edit it. 'Effortlessly simple' appears 4 times — effortlessly repetitive is more like it."

APP/SITE DATA:
${JSON.stringify(appData, null, 2)}

Return ONLY valid JSON — no markdown:
{
  "score": 3.2,
  "headline": "Savage one-liner using their actual app name (max 12 words)",
  "roasts": [
    {
      "category": "Title",
      "score": 5,
      "roast": "2 sentence savage roast referencing their EXACT words",
      "fix": "One sarcastic but actionable fix"
    },
    {
      "category": "Description",
      "score": 2,
      "roast": "2 sentence savage roast",
      "fix": "One sarcastic but actionable fix"
    },
    {
      "category": "Screenshots",
      "score": 1,
      "roast": "2 sentence savage roast",
      "fix": "One sarcastic but actionable fix"
    }
  ],
  "better_student": {
    "app_name": "Name of the top-performing competitor",
    "roast": "Savage 2-sentence explanation of why their listing (screenshots/copy) is superior to this app's."
  },
  "verdict": "2 sentence brutal final summary",
  "fix_today": "The ONE thing that would save this listing from obscurity"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    
    // 3.5 Prepare Prompt & Screenshots
    const parts: any[] = [{ text: savagePrompt }];
    
    if ('screenshots' in appData && Array.isArray(appData.screenshots) && appData.screenshots.length > 0) {
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

    // 4. Charge the user or increment free tries
    if (isPaidRoast && adminDb && user) {
      const docRef = adminDb.collection('profiles').doc(user.uid);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const profile = docSnap.data();
        if (profile && profile.credits > 0) {
          await docRef.update({ credits: profile.credits - 1 });
        }
      }
    } else {
      // Increment free try limit
      const identifier = user ? user.uid : ip;
      const tries = (await redis.get<number>(`tries:${identifier}`)) || 0;
      await redis.set(`tries:${identifier}`, tries + 1);
    }

    return NextResponse.json({ success: true, data: roastJson, type: appData.type, screenshots: ('screenshots' in appData ? appData.screenshots : []) || [] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

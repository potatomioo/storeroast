import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({ 
  bearerToken: 'dummy',
  environment: 'test_mode'
});

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    
    // Convert Headers to standard JS object
    const headers: Record<string, string> = {};
    req.headers.forEach((val, key) => { headers[key] = val; });

    // Securely verify signature and unwrap payload
    const event = dodo.webhooks.unwrap(bodyText, {
      headers,
      key: process.env.DODO_WEBHOOK_SECRET!
    });
    
    console.log("Verified Dodo Webhook:", event.type);
    console.log("Payment ID:", (event.data as any)?.payment_id);
    
    if (event.type === 'payment.succeeded') {
      const payloadData = event.data as any;
      const uid = payloadData?.metadata?.uid;
      const email = payloadData?.metadata?.email || payloadData?.customer?.email || payloadData?.customer_email || (event as any).customer?.email;
      
      if (uid && adminDb) {
        // Direct document update by uid
        const docRef = adminDb.collection('profiles').doc(uid);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          const currentCredits = docSnap.data()?.credits || 0;
          await docRef.update({ credits: currentCredits + 15 });
          console.log(`Successfully added 15 credits to uid: ${uid}`);
        } else {
          // If profile doc doesn't exist for some reason, create it
          await docRef.set({ email: email || 'unknown', credits: 15 });
          console.log(`Created profile and added 15 credits to uid: ${uid}`);
        }
      } else if (email && adminDb) {
        // Fallback: Query by email if uid is somehow missing
        const profilesRef = adminDb.collection('profiles');
        const snapshot = await profilesRef.where('email', '==', email).limit(1).get();
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const currentCredits = doc.data().credits || 0;
          await doc.ref.update({ credits: currentCredits + 15 });
          console.log(`Fallback: Successfully added 15 credits to email: ${email}`);
        } else {
          console.error(`Profile not found for email: ${email} and no uid provided.`);
        }
      } else {
        console.error('Webhook received but missing both uid and email in payload.');
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

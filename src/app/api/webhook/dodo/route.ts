import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({ bearerToken: 'dummy' });

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
      const email = (event.data as any)?.customer?.email || (event.data as any)?.customer_email || (event as any).customer?.email;
      
      if (email && adminDb) {
        // Query the profile document by email
        const profilesRef = adminDb.collection('profiles');
        const snapshot = await profilesRef.where('email', '==', email).limit(1).get();
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const currentCredits = doc.data().credits || 0;
          await doc.ref.update({ credits: currentCredits + 15 });
          console.log(`Successfully added 15 credits to ${email}`);
        } else {
          console.error(`Profile not found for email: ${email}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

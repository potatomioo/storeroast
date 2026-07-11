import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { adminAuth } from '@/utils/firebaseAdmin';

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY || 'dummy',
  // Force test mode while we are testing, regardless of Vercel NODE_ENV
  environment: 'test_mode',
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let user = null;
    
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized.' }, { status: 500 });
    }
    
    try {
      user = await adminAuth.verifyIdToken(token);
    } catch (authErr: any) {
      return NextResponse.json({ error: 'Firebase Auth Error: ' + authErr.message }, { status: 401 });
    }
    
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const { return_url } = await req.json();

    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: 'pdt_0NiWKj0bTQDcbIpGEtl68',
          quantity: 1
        }
      ],
      customer: {
        email: user.email
      },
      return_url: return_url || 'https://storeroast.live',
    });

    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (error: any) {
    console.error("Dodo Checkout Error:", error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

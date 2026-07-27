"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Pricing from "@/components/home/Pricing";
import FooterCTA from "@/components/layout/FooterCTA";
import LoginCard from "@/components/auth/LoginCard";
import { auth, db } from '@/utils/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const [session, setSession] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Clean up generic Dodo redirect parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('payment_id')) {
      if (urlParams.get('status') === 'succeeded') {
        toast.success("Payment successful! Credits added.");
      } else {
        toast.error("Payment failed or was cancelled.");
      }
      window.location.replace(window.location.pathname);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (user) {
        const userRef = doc(db, 'profiles', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits || 0);
          }
        });
        setShowLogin(false);
        (window as any)._unsubscribeSnapshot = unsubscribeSnapshot;
      } else {
        setCredits(0);
        if ((window as any)._unsubscribeSnapshot) {
          (window as any)._unsubscribeSnapshot();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if ((window as any)._unsubscribeSnapshot) {
        (window as any)._unsubscribeSnapshot();
      }
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const handlePaymentMock = async () => {
    if (!session || !session.email) {
      setShowLogin(true);
      return;
    }
    
    try {
      const token = await session.getIdToken();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          return_url: window.location.origin + '?payment=success'
        })
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      toast.error('Error connecting to checkout: ' + err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black">
      <Header session={session} credits={credits} onLogout={handleLogout} onGetStarted={() => setShowLogin(true)} />

      {showLogin ? (
        <LoginCard onBack={() => setShowLogin(false)} />
      ) : (
        <div className="w-full pb-32">
          <Pricing onBuy={handlePaymentMock} isLoggedIn={!!session} />
        </div>
      )}
      
      <FooterCTA />
    </main>
  );
}

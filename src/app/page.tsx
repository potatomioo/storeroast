"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import FooterCTA from "@/components/layout/FooterCTA";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import LoadingScreen from "@/components/flow/LoadingScreen";
import ResultTeaser from "@/components/flow/ResultTeaser";
import LoginCard from "@/components/auth/LoginCard";
import { UploadCloud, Sparkles, AlertCircle, FileText, Smartphone, Globe, Share2, Lock, Unlock, PlayCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AppState = 'IDLE' | 'LOADING' | 'TEASER';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [appUrl, setAppUrl] = useState('');
  const [roastData, setRoastData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Auth & Credits State
  const [session, setSession] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);

  React.useEffect(() => {
    const handleMagicLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            // Remove the magic link query params so they don't break subsequent reloads
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            console.error("Error signing in with magic link", error);
          }
        }
      }
    };
    handleMagicLink();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (user) {
        fetchOrCreateProfile(user);
        setShowLogin(false);
      } else {
        setCredits(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchOrCreateProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'profiles', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setCredits(userSnap.data().credits || 0);
      } else {
        // Create new profile with 0 credits
        await setDoc(userRef, { email: user.email, credits: 0 });
        setCredits(0);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSession(null);
    setCredits(0);
    window.location.reload();
  };

  const handleRoastStart = async (url: string) => {
    setAppState('LOADING');
    setError(null);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (session) {
        const token = await session.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/roast', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url })
      });

      if (res.status === 403) { // LIMIT_REACHED
        setAppState('IDLE');
        setShowLogin(true);
        return;
      }
      if (res.status === 402) { // OUT_OF_CREDITS
        setAppState('IDLE');
        handlePaymentMock();
        return;
      }
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to roast');
      
      const parsedData = data.data || data;
      parsedData.screenshots = data.screenshots;
      parsedData.type = data.type;
      
      setRoastData(parsedData);
      setAppState('TEASER');
    } catch (err: any) {
      setError(err.message);
      setAppState('IDLE');
      alert(err.message);
    }
  };

  const handlePaymentMock = async () => {
    if (!session || !session.email) {
      setShowLogin(true);
      return;
    }
    
    // Redirect to the real Dodo Payment Link ($0.01 test product)
    window.location.href = `https://test.checkout.dodopayments.com/buy/pdt_0NiWKj0bTQDcbIpGEtl68?quantity=1&customer_email=${encodeURIComponent(session.email)}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black">
      <Header session={session} credits={credits} onLogout={handleLogout} />

      {showLogin ? (
        <LoginCard onBack={() => setShowLogin(false)} />
      ) : appState === 'IDLE' ? (
        <>
          <Hero onRoast={handleRoastStart} />
          <Features />
          <Pricing />
          <FooterCTA />
        </>
      ) : appState === 'LOADING' ? (
        <LoadingScreen />
      ) : appState === 'TEASER' && roastData ? (
        <ResultTeaser 
          roastData={roastData} 
          onPaid={handlePaymentMock} 
          onBack={() => setAppState('IDLE')} 
          isPaidUser={!!session && credits > 0} 
        />
      ) : null}
      
    </main>
  );
}

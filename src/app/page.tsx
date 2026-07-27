"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FooterCTA from "@/components/layout/FooterCTA";
import LoadingScreen from "@/components/flow/LoadingScreen";
import ResultTeaser from "@/components/flow/ResultTeaser";
import LoginCard from "@/components/auth/LoginCard";
import { UploadCloud, Sparkles, AlertCircle, FileText, Smartphone, Globe, Share2, Lock, Unlock, PlayCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

type AppState = 'IDLE' | 'LOADING' | 'RESULT';

export default function Home() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [appUrl, setAppUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [freeRoastData, setFreeRoastData] = useState<any>(null);
  
  // Auth & Credits State
  const [session, setSession] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
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
            toast.success("Successfully signed in!");
          } catch (error) {
            console.error("Error signing in with magic link", error);
          }
        }
      }
    };
    handleMagicLink();

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
        // Setup real-time listener for credits
        const userRef = doc(db, 'profiles', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits || 0);
          } else {
            await setDoc(userRef, { email: user.email, credits: 0 });
            setCredits(0);
          }
        });
        setShowLogin(false);
        // Save the snapshot unsubscribe function to window so we can clean it up later if needed
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

  // (fetchOrCreateProfile removed as it's now handled by onSnapshot)

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

      if (res.status === 403) {
        setAppState('IDLE');
        if (session) {
          // Logged in but out of credits
          router.push('/pricing');
        } else {
          // Not logged in and hit free limit
          setShowLogin(true);
        }
        return;
      }
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to roast');
      
      if (data.reportId) {
        router.push(`/report/${data.reportId}`);
      } else {
        setFreeRoastData(data.data);
        setAppState('RESULT');
      }
    } catch (err: any) {
      setError(err.message);
      setAppState('IDLE');
      toast.error(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black">
      <Header session={session} credits={credits} onLogout={handleLogout} onGetStarted={() => setShowLogin(true)} />

      {showLogin ? (
        <LoginCard onBack={() => setShowLogin(false)} />
      ) : appState === 'IDLE' ? (
        <>
          <Hero onRoast={handleRoastStart} />
          <Features />
        </>
      ) : appState === 'LOADING' ? (
        <LoadingScreen />
      ) : appState === 'RESULT' && freeRoastData ? (
        <ResultTeaser 
          roastData={freeRoastData} 
          onPaid={() => router.push('/pricing')} 
          onBack={() => setAppState('IDLE')} 
          isPaidUser={false} 
        />
      ) : null}
      
      <FooterCTA />
    </main>
  );
}

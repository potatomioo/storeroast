"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import FooterCTA from "@/components/layout/FooterCTA";
import Pricing from "@/components/home/Pricing";
import LoginCard from "@/components/auth/LoginCard";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";

export default function PricingPage() {
  const router = useRouter();
  const [session, setSession] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (user) {
        setShowLogin(false);
        const userRef = doc(db, "profiles", user.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits || 0);
          } else {
            setCredits(0);
          }
        });
      } else {
        setCredits(0);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setSession(null);
    setCredits(0);
  };

  const handlePayment = async () => {
    if (!session || !session.email) {
      setShowLogin(true);
      return;
    }

    try {
      const token = await session.getIdToken(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          return_url: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.replace(data.checkout_url);
      } else {
        toast.error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error("Error connecting to checkout: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#fdfdfd] text-black selection:bg-yellow-200">
      <Header
        session={session}
        credits={credits}
        onLogout={handleLogout}
        onGetStarted={() => setShowLogin(true)}
        onHome={() => router.push("/")}
        onPricing={() => {}}
      />

      <div className="w-full flex-1 flex flex-col items-center justify-center pt-8 pb-20">
        <Pricing
          onBuy={handlePayment}
          isLoggedIn={!!session}
          onBack={() => router.push("/")}
        />
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <LoginCard onBack={() => setShowLogin(false)} />
        </div>
      )}

      <FooterCTA
        onHome={() => router.push("/")}
        onPricing={() => {}}
      />
    </main>
  );
}

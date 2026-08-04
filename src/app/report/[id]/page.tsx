"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/components/layout/Header";
import FooterCTA from "@/components/layout/FooterCTA";
import ResultTeaser from "@/components/flow/ResultTeaser";
import LoadingScreen from "@/components/flow/LoadingScreen";
import toast from "react-hot-toast";

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    // 1. Auth Listener
    let unsubscribeDb: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (user) {
        unsubscribeDb = onSnapshot(doc(db, 'profiles', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits || 0);
          }
        });
      } else {
        setCredits(0);
        if (unsubscribeDb) unsubscribeDb();
      }
    });

    // 2. Fetch Report
    const fetchReport = async () => {
      if (!id || typeof id !== 'string') {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'reports', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // restructure to match ResultTeaser props
          const roastData = data.roastData;
          roastData.screenshots = data.screenshots;
          roastData.type = data.type;
          roastData.isPaid = data.isPaid;
          setReport(roastData);
        } else {
          toast.error("Report not found!");
          router.push('/');
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
    return () => {
      unsubscribeAuth();
      if (unsubscribeDb) unsubscribeDb();
    };
  }, [id, router]);

  const handleLogout = async () => {
    await auth.signOut();
    setSession(null);
    setCredits(0);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black">
        <Header session={session} credits={credits} onLogout={handleLogout} onGetStarted={() => router.push('/')} />
        <LoadingScreen />
      </main>
    );
  }

  if (!report) return null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black">
      <Header session={session} credits={credits} onLogout={handleLogout} onGetStarted={() => router.push('/')} />
      
      <ResultTeaser 
        roastData={report} 
        onPaid={() => router.push('/pricing')} 
        onBack={() => window.location.replace('/')} 
        isPaidUser={report.isPaid || (!!session && credits > 0)} 
      />
      
      <FooterCTA />
    </main>
  );
}

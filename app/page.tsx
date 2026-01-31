"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Code, Globe, Zap, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import LoginPopup from "@/components/LoginPopup";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleShareIdea = () => {
    if (isSignedIn) {
      window.location.href = "/submit-idea";
    } else {
      setShowLoginPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-zinc-800 selection:text-white flex flex-col items-center relative overflow-hidden">
      
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl px-6 pb-20 pt-32 relative z-10">
        
        {/* Badge with Green Blink */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-zinc-300 tracking-wide">
            Open Source <span className="text-zinc-600 px-1">·</span> Community Driven <span className="text-zinc-600 px-1">·</span> V0
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6">
          Build open source.
          <br />
          <span className="text-zinc-500">Together.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed text-zinc-400">
          Share project ideas, contribute to open-source code,
          and collaborate with developers — without the noise.
        </p>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-20 w-full justify-center">
          
          {/* 1. Primary Action */}
          <Link 
            href="/projects" 
            className="bg-white text-black min-w-[140px] px-6 py-3 rounded-md font-medium text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
          >
            Start Building
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* 2. Secondary Action */}
          <button 
            onClick={handleShareIdea}
            className="px-6 py-3 min-w-[140px] rounded-md font-medium text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            Share an Idea
          </button>

          {/* 3. Community POP - Dark Surface, Light Border, Subtle Shadow */}
          <Link 
            href="/community" 
            className="px-6 py-3 min-w-[140px] rounded-md font-medium text-sm bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-zinc-400" />
            Join Community
          </Link>
        </div>

        {/* Compact Feature Grid - No Shadow */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-lg w-full max-w-2xl overflow-hidden">
          <FeatureCell icon={Globe} label="Open Source" />
          <FeatureCell icon={Code} label="Ideas" />
          <FeatureCell icon={Users} label="Collaborate" />
          <FeatureCell icon={Zap} label="Build" />
        </div>

      </main>
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to share your idea and collaborate with our community."
      />
    </div>
  );
}

function FeatureCell({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="bg-[#050505] py-6 px-4 flex flex-col items-center justify-center gap-3 group hover:bg-zinc-900/20 transition-colors cursor-default">
      <Icon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors duration-300" />
      <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
        {label}
      </span>
    </div>
  );
}
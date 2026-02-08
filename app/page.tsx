"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, ArrowRight, Lightbulb, GitPullRequest, Heart, Globe, Coffee } from "lucide-react";
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
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
      
      <main className="flex-1 flex flex-col items-center w-full max-w-5xl px-6 pt-32 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24">
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-default group">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-zinc-300 tracking-wide group-hover:text-white transition-colors">
                Open Source <span className="text-zinc-600 px-1">·</span> Community Driven <span className="text-zinc-600 px-1">·</span> V0
            </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6">
            Build open source.
            <br />
            <span className="text-zinc-500">Together.</span>
            </h1>

            <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed text-zinc-400">
            Share project ideas, contribute to open-source code,
            and collaborate with developers — without the noise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
            <Link 
                href="/projects" 
                className="bg-white text-black min-w-[140px] px-6 py-3 rounded-md font-medium text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
            >
                Start Building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button 
                onClick={handleShareIdea}
                className="px-6 py-3 min-w-[140px] rounded-md font-medium text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
                Share an Idea
            </button>

            <Link 
                href="https://chat.whatsapp.com/LiVK87vB8rQL5QBC0yrRbT?mode=gi_t" 
                className="px-6 py-3 min-w-[140px] rounded-md font-medium text-sm bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2"
            >
                <Users className="w-4 h-4 text-zinc-400" />
                Join Community
            </Link>
            </div>
        </div>

        {/* --- 1️⃣ WHAT YOU CAN DO --- */}
        <div className="w-full mb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard 
                    icon={Lightbulb}
                    title="Share Ideas"
                    description="Have a concept? Post it here to find collaborators and get feedback immediately."
                />
                <FeatureCard 
                    icon={GitPullRequest}
                    title="Contribute"
                    description="Explore active projects, fork repositories, and submit PRs to build your portfolio."
                />
                <FeatureCard 
                    icon={Heart}
                    title="Community"
                    description="Connect with like-minded developers, find mentors, and build amazing things together."
                />
            </div>
        </div>

        {/* --- 2️⃣ HOW IT WORKS (ROADMAP) --- */}
        <div className="w-full max-w-4xl mb-32 relative">
             <div className="text-center mb-24">
                <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2">Roadmap</h2>
                <h3 className="text-3xl text-white font-semibold tracking-tight">How OpenForge Works</h3>
             </div>

            {/* Glowing Main Vertical Line */}
            <div className="absolute left-[19px] md:left-1/2 top-20 bottom-0 w-px bg-gradient-to-b from-zinc-800 via-emerald-500/20 to-zinc-800 md:-ml-[0.5px]"></div>

            <div className="flex flex-col gap-20">
                <TimelineItem 
                    step="01"
                    title="Post or Explore"
                    description="Share your next big idea or browse existing open-source projects looking for help."
                    align="left"
                />
                <TimelineItem 
                    step="02"
                    title="Contribute & Build"
                    description="Fork repositories, submit pull requests, and solve real-world coding challenges."
                    align="right"
                />
                <TimelineItem 
                    step="03"
                    title="Launch Together"
                    description="Collaborate with the community to ship products that matter to real users."
                    align="left"
                />
            </div>
        </div>

        {/* --- 3️⃣ OPEN SOURCE PROMISE --- */}
        <div className="w-full max-w-3xl mb-32 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-2 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]">
                <Globe className="w-8 h-8 text-emerald-500" />
            </div>
            
            <div className="space-y-4">
                <h3 className="text-white text-3xl md:text-4xl font-semibold tracking-tight">
                    Fully open source. Built in public.
                </h3>
                <p className="text-zinc-500 text-lg">
                    No lock-in. No gatekeeping. Just pure community collaboration.
                </p>
            </div>
        </div>

        {/* --- 4️⃣ BUY ME A COFFEE (RESTORED) --- */}
        <div className="w-full max-w-xl mb-32">
             <div className="relative rounded-2xl border border-yellow-500/20 bg-[#0A0A0A] p-8 text-center overflow-hidden hover:border-yellow-500/40 transition-colors duration-500 group">
                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity"></div>

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-[#FFDD00] rounded-xl flex items-center justify-center text-black mb-2 shadow-[0_0_20px_-5px_rgba(255,221,0,0.5)] rotate-3 hover:rotate-6 transition-transform duration-300">
                        <Coffee className="w-6 h-6 fill-black" />
                    </div>
                    
                    <h3 className="text-white text-xl font-semibold">Fuel the Development</h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                        OpenForge is built by the community, for the community. Your support helps keep the servers running and the code flowing.
                    </p>

                    <a 
                        href="https://buymeacoffee.com/krishgupta5" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 bg-[#FFDD00] text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#ffe44d] hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(255,221,0,0.4)]"
                    >
                        <Coffee className="w-4 h-4 fill-black" />
                        Buy Me a Coffee
                    </a>
                </div>
             </div>
        </div>

      </main>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="w-full py-12 flex justify-center items-center">
          <p className="text-xs text-zinc-800 font-medium select-none">
            © 2026 OpenForge Community
          </p>
      </footer>
      
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to share your idea and collaborate with our community."
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="group p-6 rounded-xl border border-zinc-800 bg-[#0A0A0A] hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-zinc-700 transition-all duration-300">
                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-white font-medium mb-2 group-hover:translate-x-1 transition-transform">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                {description}
            </p>
        </div>
    )
}

function TimelineItem({ step, title, description, align }: { step: string, title: string, description: string, align: 'left' | 'right' }) {
    return (
        <div className={`relative flex flex-col md:flex-row items-center w-full group`}>
            
            {/* 1. LEFT SIDE CONTENT */}
            <div className={`hidden md:flex w-1/2 ${align === 'left' ? 'justify-end pr-16 text-right' : 'justify-start pl-16 text-left'}`}>
                {align === 'left' && (
                    <div className="group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="relative">
                             <span className="absolute -top-8 -right-4 text-6xl font-bold text-zinc-900/50 select-none z-0 group-hover:text-zinc-800 transition-colors">{step}</span>
                             <h4 className="relative z-10 text-white font-medium mb-2 text-xl">{title}</h4>
                        </div>
                        <p className="relative z-10 text-zinc-500 leading-relaxed max-w-sm ml-auto group-hover:text-zinc-400 transition-colors">
                            {description}
                        </p>
                    </div>
                )}
            </div>

            {/* 2. CENTER NODE */}
            <div className="absolute left-[3px] md:left-1/2 w-8 h-8 md:-ml-4 rounded-full bg-[#050505] border border-zinc-700 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.8)] z-10 flex items-center justify-center transition-all duration-500">
                <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-emerald-400 transition-colors"></div>
            </div>

            {/* Horizontal Connector Line (Desktop) */}
            <div className={`hidden md:block absolute top-1/2 h-px bg-zinc-800 w-12 transition-all duration-300 group-hover:bg-emerald-500 group-hover:w-16 ${align === 'left' ? 'right-1/2 mr-4' : 'left-1/2 ml-4'}`}></div>

            {/* 3. RIGHT SIDE CONTENT */}
            <div className={`hidden md:flex w-1/2 ${align === 'right' ? 'justify-start pl-16 text-left' : 'justify-end pr-16 text-right'}`}>
                {align === 'right' && (
                    <div className="group-hover:-translate-y-1 transition-transform duration-300">
                         <div className="relative">
                             <span className="absolute -top-8 -left-4 text-6xl font-bold text-zinc-900/50 select-none z-0 group-hover:text-zinc-800 transition-colors">{step}</span>
                             <h4 className="relative z-10 text-white font-medium mb-2 text-xl">{title}</h4>
                        </div>
                        <p className="relative z-10 text-zinc-500 leading-relaxed max-w-sm mr-auto group-hover:text-zinc-400 transition-colors">
                            {description}
                        </p>
                    </div>
                )}
            </div>

            {/* 4. MOBILE CONTENT */}
            <div className="flex md:hidden w-full pl-16 pr-4">
                 <div className="text-left">
                    <span className="text-xs font-bold text-emerald-500 mb-1 block">STEP {step}</span>
                    <h4 className="text-white font-medium mb-2 text-lg">{title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

        </div>
    )
}
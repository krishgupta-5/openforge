"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ArrowLeft, Target, Users, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    // Added pt-20 to push content down below the floating navbar
    <div className="h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-zinc-800 selection:text-white pt-20 lg:pt-0">
      
      {/* Left Section - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 p-12 relative z-10 flex-col justify-center">
        <div className="flex flex-col justify-center h-full">
          <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold">OpenForge</span>
          </Link>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Start Your Journey
            </h1>
            <p className="text-xl text-zinc-400 mb-12">
              Create your account and join a community of motivated learners.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-800">
                  <Target className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Set Your Goals</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Define personal and cohort-wide tasks. Track your progress with detailed analytics.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-800">
                  <Users className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Collaborate & Help</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Use Socket Overflow to get instant answers or assist classmates when they're blocked.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-800">
                  <Zap className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Stay Motivated</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Compete with peers, earn badges, and win monthly rewards for top performers.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <div className="flex gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-500 mb-2">Important: Cohort Access Required</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Your email must be in the cohort allowlist to access the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10 h-full">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold">OpenForge</span>
            </Link>
            <Link 
              href="/"
              className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Sign Up Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-zinc-400 text-sm">Welcome! Please fill in the details to get started.</p>
            </div>

            {/* Clerk Sign Up Component */}
            <div className="mb-2">
              <SignUp 
                appearance={{
                  baseTheme: dark,
                  elements: {
                    // Hides the entire footer (including Dev Mode badge and "Secured by Clerk")
                    footer: "hidden",
                    
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    // Social Buttons
                    socialButtonsBlockButton: "w-full bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 rounded-lg font-medium transition-colors py-3 px-4 text-sm",
                    socialButtonsBlockButtonText: "font-medium text-zinc-300 text-sm",
                    // Completely remove form elements with display none
                    form: "display: none !important",
                    formField: "display: none !important",
                    formFieldInput: "display: none !important",
                    formFieldLabel: "display: none !important",
                    formButtonPrimary: "display: none !important",
                    dividerText: "display: none !important",
                    // Footer
                    footerActionLink: "text-white hover:text-zinc-300 font-medium underline-offset-4",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                  }
                }}
                redirectUrl="/"
                signInUrl="/sign-in"
              />
            </div>

            <div className="text-center mt-6">
              <p className="text-xs text-zinc-500">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-white font-medium hover:text-zinc-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Custom Footer Text (Replacing the hidden Clerk one) */}
            <div className="mt-8 text-center border-t border-zinc-800/50 pt-6">
              <p className="text-[10px] text-zinc-600">Secured by Clerk</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
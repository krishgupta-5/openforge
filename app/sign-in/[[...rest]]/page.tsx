"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ArrowLeft, Shield, Lock, UserCheck } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    // Added pt-20 to push content down below the floating navbar
    // h-screen + overflow-hidden keeps it scroll-free
    <div className="h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-zinc-800 selection:text-white pt-20 lg:pt-0">
      
      {/* Left Section - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 p-12 relative z-10 flex-col justify-center">
        {/* Added mt-20 to desktop view specifically if navbar overlaps there too */}
        <div className="flex flex-col justify-center h-full">
          <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold">OpenForge</span>
          </Link>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-zinc-400 mb-12">
              Sign in to continue your learning journey and reconnect with your cohort.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-800">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Your account is protected with industry-standard security and encryption.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-800">
                  <UserCheck className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick Sign-In</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Use your GitHub or Google account for instant access to your learning dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-800">
                  <Shield className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cohort Integration</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Seamlessly access your cohort resources, assignments, and collaborative tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative z-10 h-full">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4 text-black" />
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

          {/* Sign In Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Sign in to your account</h2>
              <p className="text-zinc-400 text-sm">Welcome back! Please enter your details.</p>
            </div>

            {/* Clerk Sign In Component */}
            <div className="mb-2">
              <SignIn 
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
                    // Footer Links (Forgot Password etc)
                    footerActionLink: "text-white hover:text-zinc-300 font-medium underline-offset-4",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                  }
                }}
                redirectUrl="/"
                signUpUrl="/sign-up"
              />
            </div>

            <div className="text-center mt-6">
              <p className="text-xs text-zinc-500">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-white font-medium hover:text-zinc-300 transition-colors">
                  Sign up
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
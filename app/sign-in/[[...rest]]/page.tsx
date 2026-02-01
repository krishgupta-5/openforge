"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Shield, Lock, UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-zinc-800 selection:text-white">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white text-center mb-8 tracking-tight">
          SIGN IN
        </h1>
        
        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "w-full",
              card: "shadow-none bg-transparent p-0 w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              footer: "hidden",
              // Fixed alignment: Added flex, items-center, justify-center, and gap-3
              socialButtonsBlockButton: 
                "w-full bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 rounded-lg font-medium transition-colors py-2.5 h-10 flex items-center justify-center gap-3",
              socialButtonsBlockButtonText: 
                "font-medium text-zinc-300 text-sm",
              form: "hidden",
              formField: "hidden",
              dividerRow: "hidden",
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            },
          }}
          redirectUrl="/"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
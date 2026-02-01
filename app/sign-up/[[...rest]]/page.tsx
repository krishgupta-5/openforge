"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-zinc-800 selection:text-white">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white text-center mb-8 tracking-tight">
          SIGN UP
        </h1>
        
        <SignUp
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
              // Removed pl-4 to fix off-center text
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
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
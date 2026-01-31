"use client";

import React from "react";
import { X, LogIn } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginPopup({ isOpen, onClose, message }: LoginPopupProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Close popup if user becomes signed in
  React.useEffect(() => {
    if (isSignedIn && isOpen) {
      onClose();
    }
  }, [isSignedIn, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] border border-zinc-800 rounded-xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Minimal Content Wrapper */}
        <div className="flex flex-col items-center text-center">
          
          {/* Icon - Clean Login Symbol */}
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800 group">
            <LogIn className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors ml-0.5" />
          </div>

          {/* Text */}
          <h2 className="text-lg font-bold text-white mb-2">
            Login Required
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-[250px] mb-6">
            {message || "You need to be signed in to perform this action."}
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-2">
            <button
              onClick={() => {
                openSignIn();
                onClose();
              }}
              className="w-full bg-white text-black text-sm font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Sign In
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-zinc-600 text-xs hover:text-zinc-400 transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
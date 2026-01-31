"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- FLOATING CONTAINER --- */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
        {/* --- CAPSULE NAV --- */}
        <nav className="flex items-center justify-between gap-8 rounded-full border border-white/10 bg-transparent backdrop-blur-md px-6 py-2.5 shadow-xl shadow-black/10">
          {/* --- LEFT: BRAND (TEXT ONLY) --- */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* ICON REMOVED HERE */}
            <span className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
              OpenForge
            </span>
          </Link>

          {/* --- CENTER: LINKS --- */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/ideas">Ideas</NavLink>
            <NavLink href="/contribute">Contribute</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xs font-medium text-neutral-300 hover:text-white transition-colors px-2 focus:outline-none">
                  Log In
                </button>
              </SignInButton>

              <div className="w-px h-4 bg-white/10 mx-1"></div>

              <SignUpButton mode="modal">
                <button className="text-xs font-bold text-white hover:text-white/80 transition-colors bg-white/10 px-4 py-1.5 rounded-full border border-white/5 hover:bg-white/20 focus:outline-none">
                  Join
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-7 h-7 ring-1 ring-white/10 hover:ring-white/30 transition-all",
                    },
                  }}
                />
              </div>
            </SignedIn>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-neutral-400 hover:text-white ml-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-64 bg-black/90 backdrop-blur-md border-l border-white/10">
            <div className="flex flex-col p-6 pt-20">
              <div className="flex flex-col gap-4">
                <MobileNavLink href="/projects" onClick={() => setIsMobileMenuOpen(false)}>
                  Projects
                </MobileNavLink>
                <MobileNavLink href="/ideas" onClick={() => setIsMobileMenuOpen(false)}>
                  Ideas
                </MobileNavLink>
                <MobileNavLink href="/contribute" onClick={() => setIsMobileMenuOpen(false)}>
                  Contribute
                </MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </MobileNavLink>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <SignedOut>
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <button 
                        className="w-full text-xs font-medium text-neutral-300 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 focus:outline-none text-left"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log In
                      </button>
                    </SignInButton>
                    
                    <SignUpButton mode="modal">
                      <button 
                        className="w-full text-xs font-bold text-white hover:text-white/80 transition-colors bg-white/10 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/20 focus:outline-none text-left"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Join
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox:
                            "w-8 h-8 ring-1 ring-white/10 hover:ring-white/30 transition-all",
                        },
                      }}
                    />
                    <span className="text-sm text-white/80">Account</span>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- HELPER COMPONENTS ---
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      // Added focus:outline-none to remove browser default click rings
      // Added border-transparent to the inactive state to ensure smooth transition when the active border is removed
      className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 rounded-full focus:outline-none border ${
        isActive
          ? "text-white bg-white/10 border-white/5"
          : "text-neutral-400 hover:text-white hover:bg-white/5 border-transparent"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
        isActive
          ? "text-white bg-white/10 border border-white/5"
          : "text-neutral-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}

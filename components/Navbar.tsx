"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
  SignOutButton,
} from "@clerk/nextjs";
import { Menu, X, LogOut, User, Settings } from "lucide-react";

// --- CUSTOM PROFILE BUTTON (DESKTOP ONLY) ---
function CustomProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-8 h-8 rounded-full overflow-hidden transition-all duration-300 ring-2 flex items-center justify-center ${
          isOpen ? "ring-white/30 scale-105" : "ring-transparent hover:ring-white/20"
        }`}
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <User className="w-4 h-4 text-neutral-400" />
          </div>
        )}
      </button>

      {/* DESKTOP DROPDOWN (Right Side + Lower Down) */}
      {/* CHANGES: 
          1. 'left-full': Keeps it to the RIGHT.
          2. 'top-8': Pushes the start of the menu down to align with the BOTTOM of the button.
          3. 'mt-2': Adds a tiny bit more breathing room vertically.
          4. 'ml-4': Keeps the horizontal gap.
      */}
      {isOpen && (
        <div 
          className="absolute top-8 left-full ml-4 mt-2 w-72 origin-top-left rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 focus:outline-none z-[100] overflow-hidden animation-fade-in"
        >
          {/* User Header */}
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 flex items-center justify-center bg-neutral-800">
                    {user?.imageUrl ? (
                          <img src={user?.imageUrl} alt={user?.fullName || "User"} className="w-full h-full object-cover block"/>
                    ) : (
                          <User className="w-5 h-5 text-neutral-400" />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                        {user?.fullName || user?.username || "User"}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                    </p>
                </div>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="p-1.5 flex flex-col gap-1">
            <button
              onClick={() => {
                setIsOpen(false);
                openUserProfile();
              }}
              className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5 group"
            >
              <Settings className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              Manage Account
            </button>

            <div className="h-px bg-white/5 my-0.5 mx-2" />

            <SignOutButton>
              <button 
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2.5"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN NAVBAR COMPONENT ---
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* --- FLOATING CONTAINER --- */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
        <nav className="flex items-center justify-between gap-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-6 py-2.5 shadow-xl shadow-black/10 transition-colors duration-300">
          
          {/* --- LEFT: BRAND --- */}
          <Link href="/" className="flex items-center gap-2 group z-50" onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setIsMobileMenuOpen(false);
          }}>
            <span className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
              OpenForge
            </span>
          </Link>

          {/* --- CENTER: LINKS (DESKTOP) --- */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/ideas">Ideas</NavLink>
            <NavLink href="/contribute">Contribute</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/auth/sign-up">
                <button className="hidden md:block text-xs font-bold text-white hover:text-white/80 transition-colors bg-white/10 px-4 py-1.5 rounded-full border border-white/5 hover:bg-white/20 focus:outline-none">
                  Get Started
                </button>
              </Link>
            </SignedOut>

            <SignedIn>
              {/* Desktop Profile Button (Dropdown) */}
              <div className="hidden md:flex items-center justify-center">
                <CustomProfileButton />
              </div>
            </SignedIn>

            {/* Mobile Toggle Button */}
            <button
              className="md:hidden text-neutral-400 hover:text-white ml-2 focus:outline-none flex items-center justify-center relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black flex flex-col items-center justify-center animation-fade-in overflow-y-auto">
          
          <div className="flex flex-col items-center gap-8 w-full px-8 py-20">
            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
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
            
            {/* Request Callback REMOVED */}

            {/* --- MOBILE EMBEDDED PROFILE --- */}
            <SignedIn>
              <div className="mt-4 w-full max-w-[280px] p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-4">
                {/* User Info */}
                <div className="flex flex-col items-center text-center gap-2">
                   <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10">
                      {user?.imageUrl ? (
                         <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full bg-neutral-800 flex items-center justify-center"><User className="w-6 h-6 text-neutral-400"/></div>
                      )}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-white font-medium text-lg leading-tight">{user?.fullName || "User"}</span>
                      <span className="text-white/40 text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
                   </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5" />

                {/* Actions */}
                <div className="w-full flex flex-col gap-2">
                   <button 
                      onClick={() => { openUserProfile(); setIsMobileMenuOpen(false); }}
                      className="w-full py-2.5 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg transition-colors"
                   >
                      <Settings className="w-4 h-4" />
                      Manage Account
                   </button>
                   
                   <SignOutButton>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-2.5 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
                      >
                         <LogOut className="w-4 h-4" />
                         Sign Out
                      </button>
                   </SignOutButton>
                </div>
              </div>
            </SignedIn>

            <SignedOut>
                <Link href="/auth/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="px-8 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full border border-white/5 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
            </SignedOut>
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
      className={`text-lg font-medium transition-colors duration-300 ${
        isActive ? "text-white" : "text-neutral-400 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
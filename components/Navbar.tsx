"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* --- LEFT: TEXT ONLY (NO ICON) --- */}
        <Link href="/" className="group transition-opacity hover:opacity-80">
          <span className="font-bold tracking-tight text-white text-lg">
            OpenForge
          </span>
        </Link>

        {/* --- CENTER: MAIN NAVIGATION --- */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8">
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/ideas">Ideas</NavLink>
          <NavLink href="/contribute">Contribute</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>

        {/* --- RIGHT: ACTIONS & AUTH --- */}
        <div className="flex items-center gap-4">
          {/* --- AUTH BUTTONS --- */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors tracking-wide uppercase">
                Log In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-white px-6 font-medium text-black transition-all hover:bg-gray-200">
                <span className="relative text-xs font-bold uppercase tracking-wide">
                  Join
                </span>
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                href="/new-idea"
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                title="Share new idea"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5V19M5 12H19" />
                </svg>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 border border-white/10 ring-2 ring-transparent hover:ring-white/10 transition-all",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

// --- HELPER COMPONENT ---
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

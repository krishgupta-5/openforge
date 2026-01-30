import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono p-4 transition-colors duration-300">
      {/* --- Placeholder Header --- */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">OpenForge</h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          [ Landing Page Undecided ]
        </p>
      </div>

      {/* --- Dev Navigation Links --- */}
      {/* This list helps you quickly jump to the pages you are currently building */}
      <div className="w-full max-w-md border border-white/20 rounded p-8">
        <h2 className="text-xs text-gray-500 mb-6 border-b border-white/10 pb-2">
          DEV NAVIGATION
        </h2>

        <nav className="flex flex-col gap-4">
          <Link
            href="/ideas"
            className="text-lg hover:text-green-400 hover:underline transition-colors flex justify-between"
          >
            <span>Ideas Page</span>
            <span className="text-gray-400 text-sm">/ideas</span>
          </Link>

          <Link
            href="/projects"
            className="text-lg hover:text-green-400 hover:underline transition-colors flex justify-between"
          >
            <span>Projects Page</span>
            <span className="text-gray-400 text-sm">/projects</span>
          </Link>

          <Link
            href="/contribute"
            className="text-lg hover:text-green-400 hover:underline transition-colors flex justify-between"
          >
            <span>Contribute Page</span>
            <span className="text-gray-400 text-sm">/contribute</span>
          </Link>

          <Link
            href="/about"
            className="text-lg hover:text-green-400 hover:underline transition-colors flex justify-between"
          >
            <span>About Page</span>
            <span className="text-gray-400 text-sm">/about</span>
          </Link>
          {/* Add more links here as you build new pages */}
        </nav>
      </div>
    </main>
  );
}

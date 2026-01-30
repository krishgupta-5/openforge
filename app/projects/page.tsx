"use client";

import React, { useState, useEffect } from "react";
import { Globe, Github, ArrowRight } from "lucide-react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Components ---

const TechIcon = ({ name }: { name: string }) => {
  const logoMap: { [key: string]: string } = {
    React: "react.png",
    TypeScript: "typescript.png",
    Python: "python.png",
    "Next.js": "nextjs2.png",
    Tailwind: "tailwindcss.png",
    Bun: "bunjs.png",
    Vercel: "vercel.png",
    Supabase: "supabase.png",
    Solidity: "solidity.png",
    GraphQL: "graphql.png",
    WebGL: "threejs.png",
    Rust: "rust.png",
    WASM: "webassembly.png",
    Go: "go.png",
    WebRTC: "webrtc.png",
    Docker: "docker.png",
    Swift: "swift.png",
    ARKit: "arkit.png",
    "Node.js": "nodejs.png",
    TensorFlow: "pytorch.png",
    AWS: "aws.png",
    Svelte: "sveltejs.png",
    Vite: "vitejs.png",
    Linux: "linux.png",
    "D3.js": "d3js.png",
    FastAPI: "fastapi.png",
    Kubernetes: "kubernetes.png",
    "React Native": "reactnative.png",
    MongoDB: "mongodb.png",
    "Web3.js": "web3js.png",
    FFmpeg: "ffmpeg.png",
    WebSocket: "websocket.png",
  };

  const logoFile = logoMap[name];

  const FallbackIcon = () => (
    <div className="w-10 h-10 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover/icon:text-white group-hover/icon:border-neutral-500 transition-colors">
      <span className="text-[11px] font-mono font-bold uppercase tracking-tighter">
        {name.substring(0, 2)}
      </span>
    </div>
  );

  return (
    <div className="group/icon relative cursor-help">
      {/* Container */}
      <div className="transition-transform duration-300 hover:-translate-y-1">
        {!logoFile ? (
          <FallbackIcon />
        ) : (
          <div className="w-10 h-10 rounded-md bg-neutral-900/80 border border-white/10 flex items-center justify-center p-2">
            <img
              src={`/tech-stacks-logo/${logoFile}`}
              alt={name}
              className="w-full h-full object-contain opacity-90 group-hover/icon:opacity-100 transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-[10px] font-mono text-neutral-400 font-bold">${name[0]}</span>`;
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-black border border-white/20 text-white text-[10px] font-medium rounded shadow-xl opacity-0 group-hover/icon:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
        {name}
      </div>
    </div>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const isWorking = status.toLowerCase().includes("open");

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
        isWorking
          ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
          : "bg-amber-950/30 border-amber-500/20 text-amber-400"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isWorking ? "bg-emerald-500" : "bg-amber-500"
        }`}
      ></div>
      <span className="text-[11px] font-medium tracking-wide">{status}</span>
    </div>
  );
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  // --- Logic: Calculate Counts Dynamically ---
  const counts: { [key: string]: number } = {
    All: projects.length,
    Working: projects.filter((p) => p.category === "Working").length,
    Building: projects.filter((p) => p.category === "Building").length,
  };

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 pb-32">
      {/* --- Header Section --- */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Community Projects
        </h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Open-source initiatives built by developers. Explore ideas, contribute
          code, and collaborate.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* --- Controls Section --- */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-white/10">
            {["All", "Working", "Building"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab}{" "}
                <span
                  className={`text-[10px] ml-1 ${
                    activeTab === tab ? "opacity-100 font-bold" : "opacity-40"
                  }`}
                >
                  ({counts[tab]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- Projects Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="group flex flex-col bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              {/* --- Image Area (Browser Mockup) --- */}
              <div className="h-56 w-full relative overflow-hidden flex items-end justify-center px-8 pt-10">
                {project.mockupImage ? (
                  <img 
                    src={`/mockups/${project.mockupImage}`} 
                    alt={`${project.title} mockup`}
                    className="w-full h-full object-cover rounded-t-lg shadow-2xl border border-white/10"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br ${project.gradient || 'from-neutral-800 to-neutral-900'} rounded-t-lg shadow-2xl border border-white/10 flex flex-col transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500 ease-out">
                            <div class="h-8 border-b border-white/5 flex items-center px-4 gap-1.5 bg-white/5">
                              <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                              <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                              <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                            </div>
                            <div class="flex-1 p-6 flex flex-col items-center justify-center text-center">
                              <h3 class="text-lg font-bold text-white tracking-tight">${project.title}</h3>
                              <p class="text-[10px] font-mono text-neutral-600 mt-2">${project.version || 'v1.0.0'}</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${project.gradient || 'from-neutral-800 to-neutral-900'} rounded-t-lg shadow-2xl border border-white/10 flex flex-col transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500 ease-out`}>
                    {/* Window Bar - Professional Monochrome */}
                    <div className="h-8 border-b border-white/5 flex items-center px-4 gap-1.5 bg-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                    </div>

                    {/* Window Body */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-[10px] font-mono text-neutral-600 mt-2">
                        {project.version || "v1.0.0"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* --- Card Content --- */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Title & Icons */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {project.title}
                  </h2>
                  <div className="flex gap-3 text-neutral-500">
                    <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                    <Github className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-neutral-400 text-sm leading-relaxed mb-8 min-h-[40px]">
                  {project.description}
                </p>

                {/* Bottom Section */}
                <div className="mt-auto space-y-6">
                  {/* Technology Section */}
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Technology
                    </h3>
                    <div className="min-h-[32px] flex items-center">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 5).map((tech: string, i: number) => (
                          <TechIcon key={i} name={tech} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <StatusPill status={project.status} />

                    <Link 
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors group/btn"
                    >
                      View Project
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

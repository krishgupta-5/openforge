"use client";

import React, { useState, useEffect } from "react";
import { Globe, Github, ArrowRight, Eye, X } from "lucide-react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LoadingSpinner from "@/components/LoadingSpinner";

// --- Components ---

// 1. Video Modal Component
const VideoModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
  // Logic to convert various video URLs to embed URLs
  const getEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return "";
    
    // Check if it's a YouTube link
    if (videoUrl.includes("youtube.com/watch")) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Check if it's a YouTube short link
    if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Check if it's a Google Drive link
    if (videoUrl.includes("drive.google.com")) {
      // Replace /view or /view?usp=sharing with /preview
      return videoUrl.replace(/\/view.*/, "/preview");
    }
    
    return videoUrl;
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Video Container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/10 group"
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* The Iframe Player */}
        <iframe
          src={getEmbedUrl(url)}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

const TechIcon = ({ name }: { name: string }) => {
  // ... (Keeping your existing icon logic same for brevity)
  const logoMap: { [key: string]: string } = {
    React: "react.png", "Next.js": "nextjs2.png", Vue: "vuejs.png", Angular: "angular.png", Svelte: "sveltejs.png", TypeScript: "typescript.png", JavaScript: "js.png", HTML5: "html5.png", CSS3: "css3.png", Tailwind: "tailwindcss.png", Bootstrap: "bootstrap5.png", MaterialUI: "materialui.png", ChakraUI: "chakraui.png", shadcn: "shadcnui.png", "Node.js": "nodejs.png", Python: "python.png", Java: "java.png", "C#": "csharp.png", PHP: "php.png", Ruby: "ruby.png", Go: "go.png", Rust: "rust.png", Swift: "swift.png", Kotlin: "kotlin.png", Dart: "dart.png", Elixir: "elixir.png", Clojure: "clojure.png", Haskell: "haskell.png", PostgreSQL: "postgresql.png", MySQL: "mysql.png", MongoDB: "mongodb.png", Redis: "redis.png", SQLite: "sqlite.png", Elasticsearch: "elastic.png", AWS: "aws.png", Google: "google.png", Azure: "azure.png", Vercel: "vercel.png", Netlify: "netlify.png", Heroku: "heroku.png", DigitalOcean: "digitalocean.png", Cloudflare: "cloudflare.png", Docker: "docker.png", Kubernetes: "kubernetes.png", Terraform: "terraform.png", Git: "git.png", GitHub: "github.png", GitLab: "gitlab.png", NPM: "npm.png", Yarn: "yarn.png", Webpack: "webpack.png", Vite: "vitejs.png", Babel: "babel.png", ESLint: "eslint.png", Prettier: "prettier.png", Jest: "jest.png", Cypress: "cypress.png", Playwright: "playwright.png", OpenAI: "openai.png", TensorFlow: "tensorflow.png", PyTorch: "pytorch.png", HuggingFace: "huggingface.png", "React Native": "reactnative.png", Flutter: "flutter.png", Solidity: "solidity.png", "Web3.js": "web3js.png", GraphQL: "graphql.png", ThreeJS: "threejs.png", WebSocket: "websocket.png", FFmpeg: "ffmpeg.png", Supabase: "supabase.png", Firebase: "firebase.png", Figma: "figma.png", VSCode: "vscode.png", Bun: "bunjs.png", WASM: "webassembly.png", WebGL: "threejs.png", Linux: "linux.png", "D3.js": "d3js.png", FastAPI: "fastapi.png",
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
  
  // State for the video modal
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Handler to open video
  const handleOpenVideo = (e: React.MouseEvent, videoUrl?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use the provided video URL or don't open modal if no URL
    if (videoUrl) {
      setSelectedVideo(videoUrl);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading projects..." />;
  }

  const counts: { [key: string]: number } = {
    All: projects.length,
    Working: projects.filter(
      (p) => p.category === "Working" || p.status === "Working",
    ).length,
    Building: projects.filter(
      (p) => p.category === "Building" || p.status === "Building",
    ).length,
  };

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter(
          (p) => p.category === activeTab || p.status === activeTab,
        );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 pb-32">
      
      {/* --- VIDEO MODAL RENDER --- */}
      {selectedVideo && (
        <VideoModal url={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {/* --- Header Section --- */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Community Projects
        </h1>
        <p className="text-neutral-400 text-lg leading-relaxed mx-auto font-light">
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
          {filteredProjects.map((project, index) => {
            return (
              <div
                key={index}
                className="group flex flex-col bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* --- Image Area / Preview Trigger --- */}
                <div 
                  className="aspect-video w-full relative overflow-hidden rounded-t-xl bg-[#0A0A0A] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Check for both videoUrl and videos (plural)
                    const videoUrl = project.videoUrl || project.videos;
                    
                    // Only check for video URL
                    if (videoUrl) {
                      // Open video modal directly with video URL
                      handleOpenVideo(e, videoUrl);
                    }
                  }} 
                >
                  {/* Overlay Button */}
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-4 py-2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold text-xs flex items-center gap-2 shadow-2xl transform translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-3.5 h-3.5" />
                      VIEW PREVIEW
                    </div>
                  </div>
                  
                  {/* Image */}
                  {project.mockupImage ? (
                    <img
                      src={`/mockups/${project.mockupImage}`}
                      alt={`${project.title} mockup`}
                      className="w-full h-full object-cover object-top rounded-t-xl
                        md:filter md:grayscale md:blur-[2px] md:opacity-70 md:scale-100
                        filter-none grayscale-0 opacity-100
                        md:group-hover:filter-none md:group-hover:blur-0 md:group-hover:grayscale-0 md:group-hover:opacity-100
                        transition-all duration-500 ease-in-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add(
                            `bg-gradient-to-br`,
                            project.gradient ||
                            "from-neutral-800 to-neutral-900",
                          );
                        }
                      }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        project.gradient || "from-purple-900 to-indigo-900"
                      } rounded-t-xl shadow-2xl border border-white/10 flex flex-col items-center justify-center p-8`}
                    />
                  )}
                </div>

                {/* --- Card Content --- */}
                <div className="p-5 flex flex-col flex-grow relative z-10 bg-[#0A0A0A]">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white tracking-tight flex-1">
                      {project.title}
                    </h2>
                    <div className="flex gap-3 text-neutral-500 ml-4 pt-1">
                      {project.liveUrl && (
                        <Globe
                          className="w-4 h-4 hover:text-white cursor-pointer transition-colors z-30 relative"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.liveUrl, "_blank");
                          }}
                        />
                      )}
                      {project.githubUrl && (
                        <Github
                          className="w-4 h-4 hover:text-white cursor-pointer transition-colors z-30 relative"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.githubUrl, "_blank");
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Rest of the card content (Description, Tech Stack, Status) */}
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2">
                      Description
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed min-h-[40px] line-clamp-2">
                      {project.description ||
                        project.shortDescription ||
                        "No description available"}
                    </p>
                  </div>

                  <div className="mt-auto space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <h3 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest whitespace-nowrap">
                          Technology
                        </h3>
                        <div className="h-px bg-white/10 flex-1"></div>
                      </div>
                      <div className="min-h-[32px] flex items-center justify-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {(() => {
                            const techArray = Array.isArray(
                              project.technologies,
                            )
                              ? project.technologies
                              : project.techStack
                                ? project.techStack
                                    .split(",")
                                    .map((t: string) => t.trim())
                                : [];
                            return techArray
                              .slice(0, 5)
                              .map((tech: string, i: number) => (
                                <TechIcon key={i} name={tech} />
                              ));
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <StatusPill status={project.status} />
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors group/btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
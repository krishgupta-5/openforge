"use client";

import React, { useState, useEffect } from "react";
import { Globe, Github, ArrowRight, Eye, X, Settings } from "lucide-react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@clerk/nextjs";

// --- Components ---

// 1. Video Modal
const VideoModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const getEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return "";
    if (videoUrl.includes("youtube.com/watch")) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (videoUrl.includes("drive.google.com")) {
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
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/10 group"
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
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

// 2. Tech Icon
const TechIcon = ({ name }: { name: string }) => {
  const logoMap: { [key: string]: string } = {
    React: "react.png",
    "Next.js": "nextjs2.png",
    Vue: "vuejs.png",
    Angular: "angular.png",
    Svelte: "sveltejs.png",
    TypeScript: "typescript.png",
    JavaScript: "js.png",
    HTML5: "html5.png",
    CSS3: "css3.png",
    Tailwind: "tailwindcss.png",
    "Tailwind CSS": "tailwindcss.png",
    TailwindCSS: "tailwindcss.png",
    Bootstrap: "bootstrap5.png",
    MaterialUI: "materialui.png",
    ChakraUI: "chakraui.png",
    shadcn: "shadcnui.png",
    "Node.js": "nodejs.png",
    Python: "python.png",
    Java: "java.png",
    "C#": "csharp.png",
    PHP: "php.png",
    Ruby: "ruby.png",
    Go: "go.png",
    Rust: "rust.png",
    Swift: "swift.png",
    Kotlin: "kotlin.png",
    Dart: "dart.png",
    Elixir: "elixir.png",
    Clojure: "clojure.png",
    Haskell: "haskell.png",
    PostgreSQL: "postgresql.png",
    MySQL: "mysql.png",
    MongoDB: "mongodb.png",
    Redis: "redis.png",
    SQLite: "sqlite.png",
    Elasticsearch: "elastic.png",
    AWS: "aws.png",
    Google: "google.png",
    Azure: "azure.png",
    Vercel: "vercel.png",
    Netlify: "netlify.png",
    Heroku: "heroku.png",
    DigitalOcean: "digitalocean.png",
    Cloudflare: "cloudflare.png",
    Docker: "docker.png",
    Kubernetes: "kubernetes.png",
    Terraform: "terraform.png",
    Git: "git.png",
    GitHub: "github.png",
    GitLab: "gitlab.png",
    NPM: "npm.png",
    Yarn: "yarn.png",
    Webpack: "webpack.png",
    Vite: "vitejs.png",
    Babel: "babel.png",
    ESLint: "eslint.png",
    Prettier: "prettier.png",
    Jest: "jest.png",
    Cypress: "cypress.png",
    Playwright: "playwright.png",
    OpenAI: "openai.png",
    TensorFlow: "tensorflow.png",
    PyTorch: "pytorch.png",
    HuggingFace: "huggingface.png",
    "React Native": "reactnative.png",
    Flutter: "flutter.png",
    Solidity: "solidity.png",
    "Web3.js": "web3js.png",
    GraphQL: "graphql.png",
    ThreeJS: "threejs.png",
    WebSocket: "websocket.png",
    FFmpeg: "ffmpeg.png",
    Supabase: "supabase.png",
    Firebase: "firebase.png",
    Figma: "figma.png",
    VSCode: "vscode.png",
    Bun: "bunjs.png",
    WASM: "webassembly.png",
    WebGL: "threejs.png",
    Linux: "linux.png",
    "D3.js": "d3js.png",
    FastAPI: "fastapi.png",
    javascript: "js.png",
    js: "js.png",
    Js: "js.png",
    vercel: "vercel.png",
    "Type Script": "typescript.png",
    "Type script": "typescript.png",
    "type script": "typescript.png",
    JS: "js.png",
    Javascript: "js.png",
  };

  const cleanName = name.trim();
  let logoFile = logoMap[cleanName];

  if (!logoFile) {
    const lowerName = cleanName.toLowerCase();
    const matchingKey = Object.keys(logoMap).find(
      (key) => key.toLowerCase() === lowerName,
    );
    if (matchingKey) logoFile = logoMap[matchingKey];
  }

  if (!logoFile) {
    const lowerName = cleanName.toLowerCase();
    if (lowerName.includes("tailwind")) logoFile = "tailwindcss.png";
    else if (lowerName.includes("vercel")) logoFile = "vercel.png";
    else if (lowerName.includes("javascript") || lowerName === "js")
      logoFile = "js.png";
  }

  const FallbackIcon = () => (
    <div className="w-6 h-6 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
      <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">
        {name.substring(0, 2)}
      </span>
    </div>
  );

  return (
    <div className="relative group/icon" title={name}>
      {!logoFile ? (
        <FallbackIcon />
      ) : (
        <div className="w-6 h-6 rounded bg-neutral-900 border border-white/5 flex items-center justify-center p-1">
          <img
            src={`/tech-stacks-logo/${logoFile}`}
            alt={name}
            className="w-full h-full object-contain opacity-70 group-hover/icon:opacity-100 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent)
                parent.innerHTML = `<span class="text-[8px] font-mono text-neutral-500">${name[0]}</span>`;
            }}
          />
        </div>
      )}
      {/* Custom tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-white/10">
        {name}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90"></div>
        </div>
      </div>
    </div>
  );
};

// 3. Status Pill
const StatusPill = ({ status }: { status: string }) => {
  const isWorking = status.toLowerCase().includes("open");
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-medium border ${
        isWorking
          ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
          : "border-amber-500/20 text-amber-500 bg-amber-500/5"
      }`}
    >
      <div
        className={`w-1 h-1 rounded-full ${isWorking ? "bg-emerald-500" : "bg-amber-500"}`}
      ></div>
      {status}
    </div>
  );
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();

  // Simple admin check - you might want to make this more robust
  const isAdmin = isSignedIn && (
    user?.emailAddresses?.[0]?.emailAddress?.includes('admin') || 
    user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress === 'krishgupta01@gmail.com' // Add your admin email
  );

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

  const handleOpenVideo = (e: React.MouseEvent, videoUrl?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoUrl) setSelectedVideo(videoUrl);
  };

  if (loading) return <LoadingSpinner message="Loading projects..." />;

  const counts: { [key: string]: number } = {
    All: projects.length,
    "Open for Contribution": projects.filter(
      (p) => p.status && p.status.toLowerCase().includes("open"),
    ).length,
    Active: projects.filter(
      (p) => p.status && (p.status.toLowerCase().includes("building") || p.status.toLowerCase().includes("active")),
    ).length,
    Closed: projects.filter(
      (p) => p.status && (p.status.toLowerCase().includes("functioning") || p.status.toLowerCase().includes("closed")),
    ).length,
  };

  const filteredProjects =
    activeTab === "All"
      ? projects
      : activeTab === "Open for Contribution"
      ? projects.filter(
          (p) => p.status && p.status.toLowerCase().includes("open"),
        )
      : activeTab === "Active"
      ? projects.filter(
          (p) => p.status && (p.status.toLowerCase().includes("building") || p.status.toLowerCase().includes("active")),
        )
      : activeTab === "Closed"
      ? projects.filter(
          (p) => p.status && (p.status.toLowerCase().includes("functioning") || p.status.toLowerCase().includes("closed")),
        )
      : projects.filter(
          (p) => p.category === activeTab || p.status === activeTab,
        );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 pb-32">
      {selectedVideo && (
        <VideoModal
          url={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

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
        <div className="flex flex-col items-center mb-12">
          <div className="flex bg-neutral-900/50 backdrop-blur-sm p-1 rounded-lg border border-white/10">
            {["All", "Open for Contribution", "Active", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                {tab}{" "}
                <span
                  className={`text-[10px] ml-1 ${activeTab === tab ? "opacity-100 font-bold" : "opacity-40"}`}
                >
                  ({counts[tab]})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            return (
              <div
                key={project.id}
                className="group flex flex-col bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors duration-200"
              >
                {/* IMAGE CONTAINER
                  - Removed the Mac Bar (Browser Window Header)
                  - Removed pt-7 from images to remove the top gap
                */}
                <div
                  className="w-full h-48 bg-[#111] relative overflow-hidden cursor-pointer border-b border-white/5"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const videoUrl = project.videoUrl || project.videos;
                    if (videoUrl) handleOpenVideo(e, videoUrl);
                  }}
                >
                  {project.mockupImage ? (
                    <img
                      src={`/mockups/${project.mockupImage}`}
                      alt={`${project.title} mockup`}
                      // Removed pt-7 here
                      className="w-full h-full object-cover object-top transition-all duration-500 ease-in-out group-hover:scale-[1.03] group-hover:blur-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          // Removed pt-7 here
                          parent.className =
                            "w-full h-full flex items-center justify-center bg-neutral-900";
                          parent.innerHTML = `<span class="text-neutral-700 font-mono text-xs">No Preview</span>`;
                        }
                      }}
                    />
                  ) : (
                    // Removed pt-7 here
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-neutral-800 select-none">
                        {project.title[0]}
                      </span>
                    </div>
                  )}

                  {/* "Preview" Overlay */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 pointer-events-none">
                    <div className="px-3 py-1 bg-black/80 border border-white/10 rounded-full text-white font-medium text-[10px] flex items-center gap-1.5 backdrop-blur-md">
                      <Eye className="w-3 h-3" />
                      View
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow gap-3">
                  <div className="flex justify-between items-start gap-3">
                    <h2
                      className="text-base font-semibold text-white leading-tight flex-1 line-clamp-1"
                      title={project.title}
                    >
                      {project.title}
                    </h2>
                    <div className="flex gap-2 text-neutral-500 pt-0.5 shrink-0">
                      {project.liveUrl && (
                        <Globe
                          className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors"
                          onClick={() => window.open(project.liveUrl, "_blank")}
                        />
                      )}
                      {project.githubUrl && (
                        <Github
                          className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors"
                          onClick={() =>
                            window.open(project.githubUrl, "_blank")
                          }
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">
                    {project.description ||
                      project.shortDescription ||
                      project.excerpt ||
                      "No description available"}
                  </p>

                  <div className="mt-auto pt-3 flex flex-col gap-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 flex-wrap max-h-12 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                      {(() => {
                        const techArray = Array.isArray(project.technologies)
                          ? project.technologies
                          : project.techStack
                            ? project.techStack
                                .split(",")
                                .map((t: string) => t.trim())
                            : [];
                        return techArray.map((tech: string, i: number) => (
                          <TechIcon key={`${tech}-${i}`} name={tech} />
                        ));
                      })()}
                    </div>

                    <div className="flex items-center justify-between">
                      <StatusPill status={project.status} />
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="flex items-center gap-1 text-[10px] font-medium text-neutral-500 hover:text-white transition-colors group/btn"
                          >
                            <Settings className="w-2.5 h-2.5" />
                            MANAGE
                          </Link>
                        )}
                        <Link
                          href={`/projects/${project.id}`}
                          className="flex items-center gap-1 text-[10px] font-medium text-neutral-500 hover:text-white transition-colors group/btn"
                        >
                          DETAILS
                          <ArrowRight className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
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

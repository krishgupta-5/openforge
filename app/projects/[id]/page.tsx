"use client";

import React, { use, useEffect, useState } from "react";
import {
  Globe,
  Github,
  Lightbulb,
  GitPullRequest,
  ArrowLeft,
  Calendar,
  Users,
  Briefcase,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// --- Components ---

// COMPACT STAT CARD
const StatCard = ({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex flex-col justify-center px-3 py-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group">
    <div className="flex items-center gap-2 mb-1">
      <Icon
        className={`w-3.5 h-3.5 ${highlight ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-400"}`}
      />
      <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">
        {label}
      </span>
    </div>
    <span
      className={`text-sm font-semibold ${highlight ? "text-white" : "text-zinc-200"}`}
    >
      {value}
    </span>
  </div>
);

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useUser();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such project!");
        }
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/20 border-l-white"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Project Not Found</h1>
        <Link
          href="/projects"
          className="text-zinc-400 hover:text-white underline underline-offset-4 text-sm"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  // Helper for tech stack display
  const techStackArray =
    typeof project.techStack === "string"
      ? project.techStack.split(",").map((t: string) => t.trim())
      : Array.isArray(project.techStack)
        ? project.techStack
        : [];

  // Compact prose styling
  const proseClasses = `
    prose prose-invert max-w-none
    prose-headings:text-white prose-headings:font-bold prose-headings:mb-3 prose-headings:text-xl
    prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-normal prose-p:text-base prose-p:my-4
    prose-strong:text-white prose-strong:font-semibold
    prose-ul:text-zinc-400 prose-li:marker:text-zinc-600
    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
  `;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-white/20 pb-20">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-6">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-3 h-3" />
          </div>
          Back to Projects
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* ================= HERO SECTION (Compact) ================= */}

        {/* Banner Image - Reduced Height */}
        <div className="w-full h-[220px] md:h-[300px] rounded-2xl relative overflow-hidden mb-8 border border-white/10 bg-zinc-900 shadow-xl shadow-black/50">
          {project.mockupImage ? (
            <img
              src={`/mockups/${project.mockupImage}`}
              alt={`${project.title} mockup`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.className += ` bg-gradient-to-br ${
                  project.bannerGradient ||
                  "from-zinc-800 via-zinc-900 to-black"
                }`;
              }}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${
                project.bannerGradient ||
                "from-pink-600 via-purple-700 to-indigo-800"
              }`}
            ></div>
          )}
        </div>

        {/* Title & Meta Area - Reduced Spacing */}
        <div className="flex flex-col gap-4 mb-8 border-b border-zinc-800/50 pb-8">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {project.tags?.slice(0, 3).map((tag: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-light max-w-3xl">
              {project.shortDescription}
            </p>
          </div>

          {/* COMPACT STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mt-2">
            {project.timeline && (
              <StatCard
                icon={Calendar}
                label="Timeline"
                value={project.timeline}
              />
            )}
            {project.role && (
              <StatCard icon={Briefcase} label="Role" value={project.role} />
            )}
            {project.team && (
              <StatCard icon={Users} label="Team Size" value={project.team} />
            )}
            <StatCard
              icon={Activity}
              label="Status"
              value={project.status || "Ongoing"}
              highlight={true}
            />
          </div>

          {/* Compact Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Link
              href="/feature-ideas"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Idea
            </Link>

            <Link
              href="/contribute-form"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              Contribute
            </Link>

            <div className="w-px h-6 bg-zinc-800 mx-1 hidden sm:block"></div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-zinc-300 transition-colors px-3 py-2"
              >
                <Globe className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              <Github className="w-3.5 h-3.5" /> Source
            </a>
          </div>
        </div>

        {/* ================= CONTENT BODY (Compact) ================= */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          {project.overview && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-zinc-700 font-light">#</span> Overview
              </h2>
              <div className={proseClasses}>
                <MarkdownRenderer content={project.overview} />
              </div>
            </div>
          )}

          {/* Tech Stack - Compact Pills */}
          {techStackArray.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-zinc-700 font-light">#</span> Tech Stack
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {techStackArray.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:text-white hover:border-zinc-700 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Other Sections */}
          {[
            { title: "What Users Can Do", content: project.whatUsersCanDo },
            { title: "Why I built this", content: project.whyIBuiltThis },
            { title: "Features", content: project.features },
            { title: "After launch & Impact", content: project.impact },
            { title: "Future Plans", content: project.futurePlans },
          ].map(
            (section, idx) =>
              section.content && (
                <div key={idx}>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-zinc-700 font-light">#</span>{" "}
                    {section.title}
                  </h2>
                  <div className={proseClasses}>
                    <MarkdownRenderer content={section.content} />
                  </div>
                </div>
              ),
          )}

          {/* Footer */}
          <div className="pt-10 border-t border-zinc-800 flex flex-col items-center justify-center gap-6">
            <Link
              href="/projects"
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

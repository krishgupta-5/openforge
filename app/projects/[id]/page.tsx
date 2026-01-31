"use client";

import React, { use, useEffect, useState } from "react";
import {
  Globe,
  Github,
  Lightbulb,
  GitPullRequest,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// --- Components ---

const InfoItem = ({
  label,
  value,
  isPill = false,
}: {
  label: string;
  value: string;
  isPill?: boolean;
}) => (
  <div className="flex flex-col gap-1 px-6 first:pl-0 last:pr-0 border-r border-zinc-800 last:border-r-0">
    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
      {label}
    </span>
    {isPill ? (
      <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black">
        {value}
      </span>
    ) : (
      <span className="text-sm font-medium text-zinc-200">{value}</span>
    )}
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
      <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-blue-400 hover:text-blue-300">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-pink-500/30 pb-32">
      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-8">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Projects
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* ================= HERO SECTION ================= */}
        {/* 1. Mockup Image or Gradient Banner */}
        <div className="w-full h-[480px] rounded-3xl relative overflow-hidden mb-12 border border-white/5 bg-zinc-900">
          {project.mockupImage ? (
            <img
              src={`/mockups/${project.mockupImage}`}
              alt={`${project.title} mockup`}
              className="w-full h-full object-cover rounded-3xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.className = `w-full h-[320px] rounded-3xl bg-gradient-to-br ${project.bannerGradient || "from-pink-500 via-purple-600 to-indigo-600"} relative overflow-hidden mb-12 border border-white/5`;
                }
              }}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${project.bannerGradient || "from-pink-500 via-purple-600 to-indigo-600"}`}
            ></div>
          )}
        </div>

        {/* 2. Project Meta Info (Tags, Title, Stats) */}
        <div className="flex flex-col gap-8 mb-16">
          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold border border-white">
              {project.status}
            </span>
            {project.tags?.slice(0, 3).map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium"
              >
                {tag}
              </span>
            ))}
            {project.extraTagsCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 font-medium">
                +{project.extraTagsCount} more
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">
              {project.shortDescription}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="w-full md:w-fit flex items-center bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
            {project.timeline && (
              <InfoItem label="Timeline" value={project.timeline} />
            )}
            {project.role && <InfoItem label="Role" value={project.role} />}
            {project.team && <InfoItem label="Team" value={project.team} />}
            {project.status && (
              <InfoItem label="Status" value={project.status} isPill />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/feature-ideas"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-semibold hover:bg-yellow-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Lightbulb className="w-4 h-4" />
              New Feature Idea
            </Link>

            <Link
              href="/contribute-form"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <GitPullRequest className="w-4 h-4" />
              Contribute
            </Link>

            <div className="w-px h-8 bg-zinc-800 mx-2 hidden sm:block"></div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                className="flex items-center gap-2 text-sm font-medium text-white hover:text-pink-500 transition-colors"
              >
                <Globe className="w-4 h-4" /> Live Demo
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" /> Source
            </a>
          </div>
        </div>

        {/* ================= CONTENT BODY ================= */}
        <div className="max-w-4xl mx-auto border-t border-zinc-800 pt-16">
          {/* Main Content Title */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-8 group flex items-center gap-2 cursor-default">
              <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-12">##</span> {project.title}: A{" "}
              {project.category || "Project"}
            </h1>
          </div>

          {/* Overview */}
          {project.overview && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> Overview
              </h2>
              <div className="text-zinc-400 leading-relaxed prose prose-invert prose-li:marker:text-white pl-8">
                <MarkdownRenderer content={project.overview} />
              </div>
            </div>
          )}

          {/* What Users Can Do */}
          {project.whatUsersCanDo && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> What Users Can Do
              </h2>
              <div className="text-zinc-400 leading-relaxed prose prose-invert prose-li:marker:text-white pl-8">
                <MarkdownRenderer content={project.whatUsersCanDo} />
              </div>
            </div>
          )}

          {/* Why I built this */}
          {project.whyIBuiltThis && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> Why I built this
              </h2>
              <div className="text-zinc-400 leading-relaxed prose prose-invert prose-li:marker:text-white pl-8">
                <MarkdownRenderer content={project.whyIBuiltThis} />
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> Features
              </h2>
              <div className="text-zinc-400 leading-relaxed prose prose-invert prose-li:marker:text-white pl-8">
                <MarkdownRenderer content={project.features} />
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.techStack && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> Tech Stack
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-400 marker:text-white pl-8">
                {typeof project.techStack === "string"
                  ? project.techStack
                      .split(",")
                      .map((tech: string, i: number) => (
                        <li key={i}>{tech.trim()}</li>
                      ))
                  : Array.isArray(project.techStack)
                    ? project.techStack.map((tech: string, i: number) => (
                        <li key={i}>{tech}</li>
                      ))
                    : null}
              </ul>
            </div>
          )}

          {/* After launch & Impact */}
          {project.impact && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> After launch & Impact
              </h2>
              <div className="text-zinc-400 leading-relaxed prose prose-invert prose-li:marker:text-white pl-8">
                <MarkdownRenderer content={project.impact} />
              </div>
            </div>
          )}

          {/* Future Plans */}
          {project.futurePlans && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 group flex items-center gap-2 cursor-default">
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-6">#</span> Future Plans
              </h2>
              <div className="text-zinc-400 leading-relaxed prose prose-invert prose-li:marker:text-white pl-8">
                <MarkdownRenderer content={project.futurePlans} />
              </div>
            </div>
          )}

          
          {/* --- Footer / View All Projects --- */}
          <div className="pt-10 border-t border-zinc-800 flex flex-col items-center justify-center gap-8">
            <Link
              href="/projects"
              className="px-6 py-3 rounded-lg bg-zinc-200 text-black font-bold hover:bg-white transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

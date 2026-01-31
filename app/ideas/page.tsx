"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  ArrowRight,
  Code,
  Paintbrush,
  Cpu,
  Database,
  Layers,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { getIdeas, Idea } from "@/lib/firebase";

// --- Types ---
type IdeaStatus = "Open" | "In Progress" | "Completed";
type IdeaType = "New Project" | "Feature Idea";

// --- Components ---

const StatusPill = ({ status }: { status: IdeaStatus }) => {
  const isWorking = status === "In Progress" || status === "Open";
  const colorClass =
    status === "Open"
      ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/20"
      : status === "In Progress"
        ? "text-blue-400 bg-blue-950/30 border-blue-500/20"
        : "text-neutral-400 bg-neutral-800/50 border-neutral-700/50";

  const dotColor =
    status === "Open"
      ? "bg-emerald-500"
      : status === "In Progress"
        ? "bg-blue-500"
        : "bg-neutral-500";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colorClass}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
      <span className="text-[11px] font-medium tracking-wide uppercase">
        {status}
      </span>
    </div>
  );
};

const TypeBadge = ({ type }: { type: IdeaType }) => {
  const icon =
    type === "New Project" ? (
      <Sparkles className="w-3 h-3" />
    ) : (
      <Layers className="w-3 h-3" />
    );
  const style = type === "New Project" ? "text-purple-400" : "text-amber-400";
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${style}`}>
      {icon}
      {type}
    </span>
  );
};

const TagIcon = ({ tag }: { tag: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Frontend: <Layers className="w-3 h-3" />,
    Backend: <Database className="w-3 h-3" />,
    Design: <Paintbrush className="w-3 h-3" />,
    AI: <Cpu className="w-3 h-3" />,
    Realtime: <Code className="w-3 h-3" />,
    React: <Code className="w-3 h-3" />,
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800/50 border border-neutral-700/50 text-[11px] font-medium text-neutral-400 group-hover:border-neutral-600 transition-colors">
      {icons[tag] || <Code className="w-3 h-3" />}
      {tag}
    </div>
  );
};

// --- Main Page ---

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedIdeas = async () => {
      try {
        const approvedIdeas = await getIdeas('approved');
        setIdeas(approvedIdeas);
      } catch (error) {
        console.error('Error fetching approved ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedIdeas();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getTagsFromCategory = (category: string, difficulty: string) => {
    const tags = [category];
    if (difficulty.includes('Beginner')) tags.push('Beginner Friendly');
    else if (difficulty.includes('Intermediate')) tags.push('Intermediate');
    else if (difficulty.includes('Advanced')) tags.push('Advanced');
    return tags;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 pb-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 pb-32">
      {/* --- Header Section (Matched Projects Page) --- */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Ideas
        </h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Explore new projects to build or contribute to features requested by
          the community.
        </p>

        <div className="pt-4">
          <Link
            href="/submit-idea"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-8 py-3 rounded-full hover:bg-neutral-200 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Share an Idea
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* --- Ideas Grid --- */}
        {ideas.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No approved ideas yet</h3>
            <p className="text-zinc-400 mb-6">Be the first to share an amazing project idea!</p>
            <Link
              href="/submit-idea"
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2 rounded-full hover:bg-neutral-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              Share an Idea
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="group flex flex-col bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* Card Content Area - Increased Padding to Match Projects Page */}
                <div className="p-8 flex flex-col flex-grow h-full">
                  {/* Meta Row */}
                  <div className="flex items-center justify-between mb-6">
                    <TypeBadge type="New Project" />
                    <StatusPill status="Open" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-neutral-200 transition-colors">
                    {idea.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                    {idea.problem}
                  </p>

                  {/* Bottom Section */}
                  <div className="mt-auto space-y-6">
                    {/* Tags */}
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getTagsFromCategory(idea.category, idea.difficulty).map((tag, index) => (
                          <TagIcon key={index} tag={tag} />
                        ))}
                      </div>
                    </div>

                    {/* Footer / Author */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 text-xs font-bold text-neutral-400">
                          {idea.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-neutral-300 font-medium">
                            {idea.name}
                          </span>
                          <span className="text-[10px] text-neutral-600">
                            {formatDate(idea.createdAt)}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/ideas/${idea.id}`}
                        className="flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors group/btn"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { use, useEffect, useState } from "react";
import { Globe, Github, Lightbulb, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackProjectView } from "@/lib/viewTracking";
import { useUser } from "@clerk/nextjs";

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

// Reusable Heading Component with Hover Effect
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="group text-2xl font-bold text-white mb-6 flex items-center gap-2 cursor-default">
    <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5">
      #
    </span>
    {children}
  </h2>
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
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
          
          // Track view only once per page load
          if (!viewTracked) {
            await trackProjectView(id, user?.id);
            setViewTracked(true);
          }
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
  }, [id, user, viewTracked]);

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
      {/* Increased top padding here for more space from navbar */}
      <div className="max-w-5xl mx-auto px-6 pt-32">
        {/* ================= HERO SECTION ================= */}
        {/* 1. Mockup Image or Gradient Banner */}
        <div className="w-full h-[320px] rounded-3xl relative overflow-hidden mb-12 border border-white/5">
          {project.mockupImage ? (
            <img 
              src={`/mockups/${project.mockupImage}`} 
              alt={`${project.title} mockup`}
              className="w-full h-full object-cover rounded-3xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = `w-full h-[320px] rounded-3xl bg-gradient-to-br ${project.bannerGradient || 'from-pink-500 via-purple-600 to-indigo-600'} relative overflow-hidden mb-12 border border-white/5`;
                }
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${project.bannerGradient || 'from-pink-500 via-purple-600 to-indigo-600'}`}></div>
          )}
        </div>

        {/* 2. Project Meta Info (Tags, Title, Stats) */}
        <div className="flex flex-col gap-8 mb-16">
          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold border border-white">
              {project.status}
            </span>
            {project.tags?.slice(1).map((tag: string, i: number) => (
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
          {(project.timeline || project.role || project.team || project.status) && (
            <div className="w-full md:w-fit flex items-center bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
              {project.timeline && <InfoItem label="Timeline" value={project.timeline} />}
              {project.role && <InfoItem label="Role" value={project.role} />}
              {project.team && <InfoItem label="Team" value={project.team} />}
              {project.status && <InfoItem label="Status" value={project.status} isPill />}
            </div>
          )}

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
        {/* Horizontal Line (border-t) is here */}
        <div className="max-w-4xl mx-auto border-t border-zinc-800 pt-16">
          {/* Overview Section */}
          {project.overview && (
            <div className="mb-16">
              <SectionHeading>Overview</SectionHeading>
              <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.overview}
              </p>
            </div>
          )}

          {/* What Users Can Do */}
          {project.whatUsersCanDo && (
            <div className="mb-16">
              <SectionHeading>What Users Can Do</SectionHeading>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.whatUsersCanDo.split('\n').map((line: string, index: number) => (
                  <div key={index} className="mb-3">
                    {line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? (
                      <div className="flex items-start">
                        <span className="mr-2">{line.split(':')[0]}:</span>
                        <span>{line.split(':').slice(1).join(':')}</span>
                      </div>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why I built this */}
          {project.whyIBuiltThis && (
            <div className="mb-16">
              <SectionHeading>Why I built this</SectionHeading>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.whyIBuiltThis.split('\n').map((line: string, index: number) => (
                  <div key={index} className="mb-2">
                    {line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? (
                      <li className="list-disc ml-6">{line.replace(/^[•\-\d\.]\s*/, '')}</li>
                    ) : (
                      <p>{line}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && (
            <div className="mb-16">
              <SectionHeading>Features</SectionHeading>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.features.split('\n').map((line: string, index: number) => (
                  <div key={index} className="mb-2">
                    {line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? (
                      <li className="list-disc ml-6">{line.replace(/^[•\-\d\.]\s*/, '')}</li>
                    ) : (
                      <p>{line}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.techStack && (
            <div className="mb-16">
              <SectionHeading>Tech Stack</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {project.techStack.split(',').map((tech: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm rounded-lg">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* After launch & Impact */}
          {project.impact && (
            <div className="mb-16">
              <SectionHeading>After launch & Impact</SectionHeading>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.impact.split('\n').map((line: string, index: number) => (
                  <div key={index} className="mb-2">
                    {line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? (
                      <li className="list-disc ml-6">{line.replace(/^[•\-\d\.]\s*/, '')}</li>
                    ) : (
                      <p>{line}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Future Plans */}
          {project.futurePlans && (
            <div className="mb-16">
              <SectionHeading>Future Plans</SectionHeading>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.futurePlans.split('\n').map((line: string, index: number) => (
                  <div key={index} className="mb-2">
                    {line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? (
                      <li className="list-disc ml-6">{line.replace(/^[•\-\d\.]\s*/, '')}</li>
                    ) : (
                      <p>{line}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Motivation */}
          {project.motivation && (
            <div className="mb-16">
              <SectionHeading>Motivation</SectionHeading>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                {project.motivation.split('\n').map((line: string, index: number) => (
                  <div key={index} className="mb-2">
                    {line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? (
                      <li className="list-disc ml-6">{line.replace(/^[•\-\d\.]\s*/, '')}</li>
                    ) : (
                      <p>{line}</p>
                    )}
                  </div>
                ))}
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

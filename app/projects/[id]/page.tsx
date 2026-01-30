"use client";

import React, { use } from "react";
import { Globe, Github, Lightbulb, GitPullRequest } from "lucide-react";
import Link from "next/link";

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

// --- Data ---

const projects = [
  {
    id: "notesbuddy",
    title: "NotesBuddy",
    shortDescription:
      "A Notes Sharing Platform where users can read notes, give quizzes, revise from flashcards, execute code snippets, and also have PYQs, more.",
    tags: ["Completed", "Next.js", "TypeScript", "React"],
    extraTagsCount: 9,
    bannerGradient: "from-pink-500 via-purple-600 to-indigo-600",

    // Stats Bar Data
    timeline: "2 Months",
    role: "Full Stack",
    team: "Solo",
    status: "Completed",

    // Links
    githubUrl: "https://github.com/openforge/notesbuddy",
    liveUrl: "https://notesbuddy-demo.vercel.app",

    // Content
    overview:
      "NotesBuddy is a modern notes sharing platform that allows users to read notes, give quizzes, revise from flashcards, and also learn programming with interactive features.",

    features: [
      {
        title: "Find Notes",
        desc: "Search and access notes by year or semester.",
      },
      {
        title: "Share Resources",
        desc: "Share notes and materials with friends easily.",
      },
      {
        title: "Revise",
        desc: "Practice with interactive flashcards for active recall.",
      },
      {
        title: "AI Quizzes",
        desc: "Test your knowledge with AI-active quizzes.",
      },
    ],

    motivation: [
      "Notes and PYQs were scattered everywhere.",
      "Existing resources were outdated & not organized.",
      "I wanted to customize my reading experience, not just read PDFs.",
    ],

    techStack: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Shadcn UI",
      "Zod",
      "React Hook Form",
      "Razorpay SDK",
      "Monaco Editor",
      "MDX Integration",
      "Strapi (In new version)",
    ],

    impact: [
      "Got 2000+ users.",
      "Got 300k views lifetime with average 15k views during exams.",
      "Got 110+ Premium users in the same duration.",
      "Learned a lot about SEO, optimization, and how to build a product that is useful for the users.",
      "Got a lot of feedback from the users, which helped me to improve the platform.",
      "Finally found a fundamental issue in `velite` that has a memory leak issue, which was causing the platform to be slow.",
      "Built my own CMS for the platform, which is a custom CMS for the platform.",
      "Used full potential of MDX and custom components to build the platform.",
      "Later on migrated to Strapi for better Performance and full text search.",
    ],

    futurePlans: [
      "Improve the CMS system.",
      "Add AI Study Assistant.",
      "Scale to mobile app.",
    ],
  },
];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = projects.find((p) => p.id === id) || projects[0];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-pink-500/30 pb-32">
      {/* Increased top padding here for more space from navbar */}
      <div className="max-w-5xl mx-auto px-6 pt-32">
        {/* ================= HERO SECTION ================= */}
        {/* 1. Simple Gradient Banner */}
        <div
          className={`w-full h-[320px] rounded-3xl bg-gradient-to-br ${project.bannerGradient} relative overflow-hidden mb-12 border border-white/5`}
        ></div>

        {/* 2. Project Meta Info (Tags, Title, Stats) */}
        <div className="flex flex-col gap-8 mb-16">
          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold border border-white">
              {project.status}
            </span>
            {project.tags.slice(1).map((tag, i) => (
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
            <InfoItem label="Timeline" value={project.timeline} />
            <InfoItem label="Role" value={project.role} />
            <InfoItem label="Team" value={project.team} />
            <InfoItem label="Status" value={project.status} isPill />
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
        {/* Horizontal Line (border-t) is here */}
        <div className="max-w-4xl mx-auto border-t border-zinc-800 pt-16">
          {/* --- NEW SECTION ADDED HERE --- */}
          <div className="mb-16">
            <h1 className="text-3xl font-bold text-white mb-8">
              {project.title}: A Notes Sharing Platform
            </h1>

            <SectionHeading>Overview</SectionHeading>
            <p className="text-zinc-400 leading-relaxed">
              NotesBuddy is a modern notes sharing platform that allows users to
              read notes, give quizzes, revise from flashcards and also have
              PYQs, more features.
            </p>
          </div>
          {/* ------------------------------- */}

          {/* What Users Can Do */}
          <div className="mb-16">
            <SectionHeading>What Users Can Do</SectionHeading>
            <ul className="list-disc list-inside space-y-3 text-zinc-400">
              <li>
                <span className="font-semibold text-white">Find Notes:</span>{" "}
                Search and access notes by year or semester (1st to 4th year).
              </li>
              <li>
                <span className="font-semibold text-white">
                  Share Resources:
                </span>{" "}
                Share notes and materials with friends.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Use Flashcards:
                </span>{" "}
                Practice with interactive flashcards for active recall.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Attempt Quizzes:
                </span>{" "}
                Test your knowledge with practice quizzes.
              </li>
              <li>
                <span className="font-semibold text-white">Access PYQs:</span>{" "}
                Get previous year questions (PYQs) with answers.
              </li>
              <li>
                <span className="font-semibold text-white">One-Shots:</span>{" "}
                Quick review materials for last minute prep.
              </li>
              <li>
                <span className="font-semibold text-white">Topper Notes:</span>{" "}
                Handwritten notes from top-performing students.
              </li>
              <li>
                <span className="font-semibold text-white">
                  AI Study Assistant:
                </span>{" "}
                (Coming soon) Get instant answers to your study questions.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Video Material:
                </span>{" "}
                Watch video explanations for better understanding.
              </li>
            </ul>
          </div>

          {/* Why I built this */}
          <div className="mb-16">
            <SectionHeading>Why I built this</SectionHeading>
            <p className="text-zinc-400 mb-6">
              I built this platform to solve a fundamental issue I faced while
              studying as follows -
            </p>
            <ul className="list-disc list-inside space-y-3 text-zinc-400">
              <li>Professors don't share notes with students.</li>
              <li>Toppers notes are not available to everyone.</li>
              <li>Notes are scattered & not organized.</li>
              <li>
                Reading one notes and then another notes is a pain with no sync,
                same example's and tone of writing.
              </li>
              <li>
                I don't want to read notes from a pdf, i want to customize my
                reading experience.
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <SectionHeading>Tech Stack</SectionHeading>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              {project.techStack.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          </div>

          {/* After launch & Impact */}
          {project.impact && project.impact.length > 0 && (
            <div className="mb-16">
              <SectionHeading>After launch & Impact</SectionHeading>
              <ul className="list-disc list-inside space-y-3 text-zinc-400">
                {project.impact.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Future Plans */}
          {project.futurePlans && project.futurePlans.length > 0 && (
            <div className="mb-16">
              <SectionHeading>Future Plans</SectionHeading>
              <ul className="list-disc list-inside space-y-3 text-zinc-400">
                {project.futurePlans.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
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

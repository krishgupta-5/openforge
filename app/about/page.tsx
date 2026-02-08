"use client";

import React from "react";
import {
  ArrowLeft,
  Code,
  Users,
  Lightbulb,
  GitPullRequest,
  Target,
  Globe,
  Heart,
  ArrowRight,
  Layers,
  Sparkles,
  Cpu,
  Linkedin,
  Mail,
} from "lucide-react";
import Link from "next/link";

// --- Components ---

const SectionHeading = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
    <div className="p-2 rounded-lg bg-zinc-900/50 text-white border border-zinc-800">
      {icon}
    </div>
    {title}
  </h2>
);

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="p-6 bg-[#09090b] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all hover:bg-zinc-900/30 group">
    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400 mb-4 border border-zinc-800 group-hover:text-white group-hover:border-zinc-700 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
  </div>
);

// --- UPDATED CREATOR CARD ---
const CreatorCard = ({
  name,
  role,
  desc,
  icon,
  linkedin,
  email,
}: {
  name: string;
  role: string;
  desc: string;
  icon: React.ReactNode;
  linkedin?: string;
  email?: string;
}) => (
  <div className="group p-6 bg-[#09090b] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all duration-300 h-full flex flex-col">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:scale-105 transition-transform text-zinc-300 group-hover:text-white shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {role}
        </p>
      </div>
    </div>
    <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">
      {desc}
    </p>

    {/* Social Links Section */}
    <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
      <span className="text-xs font-medium text-zinc-500">Connect:</span>
      
      {/* LinkedIn Link (HTTPS) */}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      )}

      {/* Gmail Link (Fixed: Uses /u/0/ to target default account) */}
      {email && (
        <a
          // Matches the structure you provided: mail.google.com/mail/u/0/...
          // view=cm ensures the Compose window opens with the 'to' address filled
          href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Mail className="w-4 h-4" />
        </a>
      )}
    </div>
  </div>
);

// --- Main Page ---

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* --- Header (1. About the Platform) --- */}
        <div className="mb-24 pt-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            About the Platform
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
            This platform is built to bring developers together through
            open-source collaboration.
            <span className="text-zinc-200">
              {" "}
              Keep building, learning, and growing together.
            </span>
          </p>
        </div>

        {/* --- 2. What Developers Can Do --- */}
        <div className="mb-24">
          <SectionHeading
            title="What You Can Do"
            icon={<Layers className="w-5 h-5 text-blue-500" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Lightbulb className="w-5 h-5" />}
              title="Share Ideas"
              desc="Have a project in mind? Share your ideas and find a team to build them with."
            />
            <FeatureCard
              icon={<GitPullRequest className="w-5 h-5" />}
              title="Suggest Features"
              desc="Contribute to existing projects by suggesting features or improvements."
            />
            <FeatureCard
              icon={<Code className="w-5 h-5" />}
              title="Contribute Code"
              desc="Dive into open source. Fork repositories, fix bugs, and merge PRs."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Collaborate"
              desc="Don't code alone. Collaborate with like-minded developers and build as a team."
            />
          </div>
        </div>

        {/* --- 3. Our Agenda / Vision --- */}
        <div className="mb-24">
          <div className="p-8 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
            <SectionHeading
              title="Our Agenda"
              icon={<Target className="w-5 h-5 text-emerald-500" />}
            />

            <p className="text-zinc-400 mb-8 max-w-2xl">
              We believe in the power of open source and building in public.
              Here is what we stand for:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Encourage open-source contribution",
                "Turn ideas into real projects",
                "Help developers collaborate easily",
                "Create a beginner-friendly community",
                "Build everything in public",
                "This platform itself is open source",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg hover:border-zinc-700 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm text-zinc-300 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 4. Why We Built This --- */}
        <div className="mb-24">
          <SectionHeading
            title="Why We Built This"
            icon={<Heart className="w-5 h-5 text-red-500" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-red-900/20 bg-red-900/5 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-500 rounded-full" /> The
                Problem
              </h3>
              <ul className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  Many developers have great ideas but{" "}
                  <span className="text-zinc-200 font-medium">no team</span>.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  Many want to contribute but{" "}
                  <span className="text-zinc-200 font-medium">
                    don't know where to start
                  </span>
                  .
                </li>
              </ul>
            </div>

            <div className="p-8 border border-emerald-900/20 bg-emerald-900/5 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" /> The
                Solution
              </h3>
              <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                <p>We built a simple, clean platform where:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-white">Ideas meet contributors</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-white">
                      Teammates build real projects
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- 5. About the Creators --- */}
        <div className="mb-24">
          <SectionHeading
            title="Who Built This?"
            icon={<Users className="w-5 h-5 text-purple-500" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreatorCard
              name="Sahil Mishra"
              role="Build Stuff & Break Stuff"
              desc="Part of the team figuring things out together — building, experimenting, breaking things, and fixing them again. Here to learn in public and make open source feel less scary."
              icon={<Code className="w-6 h-6" />}
              linkedin="https://www.linkedin.com/in/sahilmishra03/"
              email="sahilmishra03032005@gmail.com"
            />

            <CreatorCard
              name="Krish Gupta"
              role="Makes Things Work Somehow"
              desc="Part of the team making sure things don't fall apart (most of the time). Enjoys collaborating, learning by doing, and building useful things with the community."
              icon={<Cpu className="w-6 h-6" />}
              linkedin="https://www.linkedin.com/in/krishgupta5/"
              email="krishgupta0072@gmail.com"
            />
          </div>
        </div>

        {/* --- 6. Join Us / CTA --- */}
        <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900/50 to-transparent border border-zinc-800 rounded-2xl p-12 text-center mb-12">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-700 shadow-xl">
            <Globe className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Join Us</h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto text-base">
            Whether you are a beginner, an experienced developer, or someone
            with just an idea — you are welcome here.
          </p>

          <div className="flex flex-col items-center gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Explore Projects <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
              Build. Contribute. Collaborate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
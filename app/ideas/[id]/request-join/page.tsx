"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  Github,
  Linkedin,
  Loader2,
  Globe,
  Layers,
  User,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getIdeaById, Idea } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import LoginPopup from "@/components/LoginPopup";

// --- Custom UI Components ---

const Label = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    className={`block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5 ${className}`}
  >
    {children}
  </label>
);

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all hover:border-zinc-700 ${className}`}
    {...props}
  />
);

const Textarea = ({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all hover:border-zinc-700 resize-none ${className}`}
    {...props}
  />
);

// --- Main Page Component ---

export default function RequestContributionForm() {
  const params = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    github: "",
    linkedin: "",
    portfolio: "",
    techStack: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user, isSignedIn } = useUser();

  React.useEffect(() => {
    const fetchIdea = async () => {
      try {
        if (params.id) {
          const ideaData = await getIdeaById(params.id as string);
          setIdea(ideaData || null);
        }
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.name && formData.github && formData.techStack;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!isSignedIn) {
      setShowLoginPopup(true);
      return;
    }
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);

    // Mock Submission - In a real app, this would save to your backend
    setTimeout(() => {
      console.log("Request Submitted:", {
        ...formData,
        ideaId: params.id,
        ideaTitle: idea?.title
      });
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          github: "",
          linkedin: "",
          portfolio: "",
          techStack: "",
          message: ""
        });
      }, 3000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
          <p className="text-zinc-400 mb-6">This idea may not exist or hasn't been approved yet.</p>
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2 rounded-full hover:bg-neutral-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      <div className="max-w-2xl mx-auto px-6 py-24">
        
        {/* --- Header --- */}
        <div className="mb-12">
          <Link
            href={`/ideas/${params.id}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Idea
          </Link>

          <div className="mb-6 p-4 rounded-lg bg-[#09090b] border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-2">{idea.title}</h2>
            <p className="text-sm text-zinc-400">Request to join this project and collaborate with the team.</p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            Request to Contribute
          </h1>
          <p className="text-zinc-400 text-base">
            Apply to join the team and build this idea together.
          </p>
        </div>

        {/* --- Success Toast --- */}
        {isSubmitted && (
          <div className="mb-10 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Request Sent</p>
              <p className="text-xs text-zinc-400">The idea owner will review your profile shortly.</p>
            </div>
          </div>
        )}

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-12">

          {/* SECTION 1: Personal Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Profile & Links
            </h3>
            
            <div className="space-y-5">
              
              {/* Name */}
              <div>
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sahil Mishra"
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              {/* GitHub (Required) */}
              <div>
                <Label>GitHub Profile <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Github className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="github.com/username"
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LinkedIn */}
                <div>
                  <Label>LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/in/username"
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Portfolio / Proof of Work */}
                <div>
                  <Label>Portfolio / Proof of Work</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <Input
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="Your website or best project link"
                      className="pl-11"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Skills & Message */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Expertise
            </h3>

            {/* Tech Stack */}
            <div>
              <Label>Your Tech Stack <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Layers className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <Input 
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Node.js, Tailwind, Firebase..."
                    className="pl-11"
                    required
                />
              </div>
              <p className="text-xs text-zinc-600 mt-2">List the technologies you are proficient in.</p>
            </div>

            {/* Optional Message */}
            <div>
              <Label>Why do you want to join? <span className="text-zinc-600 font-normal ml-1">(Optional)</span></Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Briefly tell us how you can help..."
                rows={3}
              />
            </div>
          </div>

          {/* SECTION 3: Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-white text-black text-sm font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Send Request"
              )}
            </button>
            <p className="text-center text-xs text-zinc-600 mt-4">
                By submitting, you agree to collaborate in good faith.
            </p>
          </div>

        </form>
      </div>
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to request to join this project and collaborate with the team."
      />
    </div>
  );
}

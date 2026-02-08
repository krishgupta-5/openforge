"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
  GitPullRequest,
  Phone,
  User,
  Lock,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createProjectContribution } from "@/lib/firebase";
import { getUserData } from "@/lib/createUser";
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
  error = "",
  suppressHydrationWarning = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { 
  error?: string;
  suppressHydrationWarning?: boolean;
}) => (
  <div>
    <input
      // FIX: text-base on mobile prevents iOS zoom
      className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-zinc-700 ${
        error
          ? "border-red-500 focus:ring-red-500/20 hover:border-red-500"
          : "border-zinc-800 focus:ring-zinc-700"
      } ${className}`}
      suppressHydrationWarning={suppressHydrationWarning}
      {...props}
    />
    {error && (
      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </p>
    )}
  </div>
);

const Textarea = ({
  className = "",
  error = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) => (
  <div>
    <textarea
      // FIX: text-base on mobile prevents iOS zoom
      className={`w-full bg-[#09090b] border rounded-lg px-4 py-3 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-zinc-700 resize-none ${
        error
          ? "border-red-500 focus:ring-red-500/20 hover:border-red-500"
          : "border-zinc-800 focus:ring-zinc-700"
      } ${className}`}
      {...props}
    />
    {error && (
      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </p>
    )}
  </div>
);

// --- Main Page Component ---

function ContributionFormPageWrapper() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const projectName = searchParams.get('projectName');
  const { user, isSignedIn } = useUser();

  return <ContributionFormPage projectId={projectId} projectName={projectName} user={user} isSignedIn={isSignedIn} />;
}

function ContributionFormPage({ projectId, projectName, user, isSignedIn }: { projectId: string | null, projectName: string | null, user: any, isSignedIn: boolean | undefined }) {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    linkedin: "",
    mobile: "",
    prLink: "",
    title: "",
    description: "",
    contributionType: "",
    experienceLevel: "",
    timeline: "",
    howCanHelp: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        setFormData(prev => ({ ...prev, name: fullName || "" }));
        
        try {
          const userData = await getUserData(user.id);
          if (userData) {
            setFormData(prev => ({
              ...prev,
              email: userData.email || user.primaryEmailAddress?.emailAddress || "",
              github: userData.github || "",
              linkedin: userData.linkedin || ""
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [isSignedIn, user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const contributionTypes = ["Feature", "Bug Fix", "Enhancement", "Documentation", "Refactor"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Contribution title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.howCanHelp.trim()) newErrors.howCanHelp = "Please describe how you can help";
    if (!formData.contributionType) newErrors.contributionType = "Please select a contribution type";
    if (!formData.experienceLevel) newErrors.experienceLevel = "Please select an experience level";
    if (!formData.timeline) newErrors.timeline = "Please select a timeline";
    
    if (!formData.prLink.trim()) {
      newErrors.prLink = "PR Link is required";
    } else {
      const githubPrPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+\/pull\/\d+\/?(\?.*)?$/;
      if (!githubPrPattern.test(formData.prLink.trim())) {
        newErrors.prLink = "Please enter a valid GitHub PR link";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (!projectId || !projectName) throw new Error('Project information is missing');

      await createProjectContribution({
        title: formData.title,
        description: formData.description,
        contributionType: formData.contributionType,
        experienceLevel: formData.experienceLevel,
        timeline: formData.timeline,
        howCanHelp: formData.howCanHelp,
        name: formData.name || 'Anonymous',
        email: formData.email,
        github: formData.github || 'N/A',
        linkedin: formData.linkedin,
        mobile: formData.mobile,
        prLink: formData.prLink,
        projectId: projectId,
        projectName: decodeURIComponent(projectName),
      });
      
      try {
        await fetch("/api/send-contribution-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "submission",
            email: formData.email,
            data: {
              name: formData.name || 'Contributor',
              projectName: decodeURIComponent(projectName),
              title: formData.title,
              contributionType: formData.contributionType,
            },
          }),
        });
      } catch (error) {
        console.error('Email error:', error);
      }
      
      setIsSubmitted(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "", email: "", github: "", linkedin: "", mobile: "", prLink: "",
          title: "", description: "", contributionType: "", experienceLevel: "", timeline: "", howCanHelp: "",
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      {/* FIX: Increased top padding to pt-32 on mobile to clear floating navbar */}
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-12 md:px-6 md:py-24">
        
        {/* --- Header --- */}
        <div className="mb-12">
          {/* Back Button */}
          <Link
            href={projectId ? `/projects/${projectId}` : "/projects"}
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to {projectName ? decodeURIComponent(projectName) : "Projects"}
          </Link>

          {/* FIX: Perfect Vertical Alignment
             - Changed 'sm:items-start' to 'sm:items-center' to align badge with text center.
             - Cleaned up badge padding/styling.
          */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center mb-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white shrink-0">
              Contribute to Project
            </h1>
            {projectName && (
              <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium">
                📁 {decodeURIComponent(projectName)}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            {projectName 
              ? `Submit your coding contribution for ${decodeURIComponent(projectName)}.`
              : "Submit your coding contribution to our platform."}
          </p>
        </div>

        {/* --- Success Toast --- */}
        {isSubmitted && (
          <div className="mb-10 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Contribution Received</p>
              <p className="text-xs text-zinc-400">Thank you for your contribution. We'll review it soon.</p>
            </div>
          </div>
        )}

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Group 1: Project Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Project Contribution Details
            </h3>

            <div>
              <Label>PR Link <span className="text-red-500">*</span></Label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <Input
                  name="prLink"
                  value={formData.prLink}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo/pull/123"
                  className="pl-11"
                  required
                  error={errors.prLink}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Share the link to your pull request for this contribution
              </p>
            </div>

            <div>
              <Label>Contribution Title <span className="text-red-500">*</span></Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Fix login bug on mobile devices"
                required
                error={errors.title}
              />
            </div>

            <div>
              <Label>Description <span className="text-red-500">*</span></Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Briefly describe your contribution and what it accomplishes"
                rows={3}
                required
                error={errors.description}
              />
            </div>
          </div>

          {/* Group 2: Contributor Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Contributor Information <span className="text-zinc-600 font-normal ml-1">(Optional)</span>
            </h3>

            <div className="space-y-5">
              <div>
                <Label>Email Address <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="pl-11"
                    required
                    error={errors.email}
                    suppressHydrationWarning={true}
                  />
                </div>
              </div>

              <div>
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="pl-11"
                    error={errors.name}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <Label>GitHub Username</Label>
                  <div className="relative">
                    <Github className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <Input
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="pl-11"
                      error={errors.github}
                    />
                  </div>
                </div>
                <div>
                  <Label>LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="pl-11"
                      error={errors.linkedin}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Mobile Number <span className="text-zinc-600 font-normal ml-1">(Optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="+91 00000 00000"
                    className="pl-11"
                    error={errors.mobile}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 text-zinc-500">
                  <Lock className="w-3 h-3" />
                  <p className="text-xs">Your number is protected and will <span className="text-zinc-400 font-medium">never be shared</span> with anyone.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Additional Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Additional Information
            </h3>

            <div>
              <Label>How You Can Help <span className="text-red-500">*</span></Label>
              <Textarea
                name="howCanHelp"
                value={formData.howCanHelp}
                onChange={handleInputChange}
                placeholder="Describe your skills and how you can contribute to this project"
                rows={4}
                required
                error={errors.howCanHelp}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className={`flex flex-col ${errors.contributionType ? "gap-2" : ""}`}>
                <Label>Contribution Type <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${errors.contributionType ? "border-red-500" : "border-zinc-800"}`}>
                    <span className={formData.contributionType ? "text-white" : "text-zinc-600"}>{formData.contributionType || "Select type"}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                  </DropdownMenuTrigger>
                  {/* FIX: Added width variable so dropdown matches trigger width */}
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                    {contributionTypes.map((type) => (
                      <DropdownMenuItem key={type} onClick={() => handleSelectChange("contributionType", type)} className="cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5">
                        {type}
                        {formData.contributionType === type && <Check className="w-3 h-3 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.contributionType && <p className="text-xs text-red-500 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.contributionType}</p>}
              </div>

              {/* Experience Level */}
              <div className={`flex flex-col ${errors.experienceLevel ? "gap-2" : ""}`}>
                <Label>Experience Level <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${errors.experienceLevel ? "border-red-500" : "border-zinc-800"}`}>
                    <span className={formData.experienceLevel ? "text-white" : "text-zinc-600"}>{formData.experienceLevel || "Select level"}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                  </DropdownMenuTrigger>
                  {/* FIX: Added width variable */}
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                    {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
                      <DropdownMenuItem key={level} onClick={() => handleSelectChange("experienceLevel", level)} className="cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5">
                        {level}
                        {formData.experienceLevel === level && <Check className="w-3 h-3 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.experienceLevel && <p className="text-xs text-red-500 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.experienceLevel}</p>}
              </div>

              {/* Timeline */}
              <div className={`flex flex-col ${errors.timeline ? "gap-2" : ""}`}>
                <Label>Timeline <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${errors.timeline ? "border-red-500" : "border-zinc-800"}`}>
                    <span className={formData.timeline ? "text-white" : "text-zinc-600"}>{formData.timeline || "Select timeline"}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                  </DropdownMenuTrigger>
                  {/* FIX: Added width variable */}
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                    {["Immediate", "1-2 weeks", "2-4 weeks", "1-2 months", "2+ months"].map((time) => (
                      <DropdownMenuItem key={time} onClick={() => handleSelectChange("timeline", time)} className="cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5">
                        {time}
                        {formData.timeline === time && <Check className="w-3 h-3 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.timeline && <p className="text-xs text-red-500 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>{errors.timeline}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black text-sm font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <GitPullRequest className="w-4 h-4" />
                  Submit Contribution
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to submit your contribution and join our community."
      />
    </div>
  );
}

export default function ContributionForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ContributionFormPageWrapper />
    </Suspense>
  );
}
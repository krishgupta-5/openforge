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
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) => (
  <div>
    <input
      className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-zinc-700 ${
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

const Textarea = ({
  className = "",
  error = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) => (
  <div>
    <textarea
      className={`w-full bg-[#09090b] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-zinc-700 resize-none ${
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

  // Pre-fill user data from authentication and Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        
        // First set basic info from Clerk
        setFormData(prev => ({
          ...prev,
          name: fullName || ""
        }));
        
        // Then fetch additional data from Firebase
        try {
          const userData = await getUserData(user.id);
          if (userData) {
            setFormData(prev => ({
              ...prev,
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

  const contributionTypes = [
    "Feature",
    "Bug Fix",
    "Enhancement",
    "Documentation",
    "Refactor",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Contribution title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // How You Can Help validation
    if (!formData.howCanHelp.trim()) {
      newErrors.howCanHelp = "Please describe how you can help";
    } else if (formData.howCanHelp.trim().length < 10) {
      newErrors.howCanHelp = "Description must be at least 10 characters";
    } else if (formData.howCanHelp.trim().length > 1000) {
      newErrors.howCanHelp = "Description must be less than 1000 characters";
    }

    // Contribution Type validation
    if (!formData.contributionType) {
      newErrors.contributionType = "Please select a contribution type";
    }

    // Experience Level validation
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Please select an experience level";
    }

    // Timeline validation
    if (!formData.timeline) {
      newErrors.timeline = "Please select a timeline";
    }

    // PR Link validation
    if (!formData.prLink.trim()) {
      newErrors.prLink = "PR Link is required";
    } else if (!/^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/pull\/\d+/.test(formData.prLink.trim())) {
      newErrors.prLink = "Please enter a valid GitHub PR link (e.g., https://github.com/username/repo/pull/123)";
    }

    // Optional field validations (only if filled)
    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.github && !/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38})$/.test(formData.github)) {
      newErrors.github = "Please enter a valid GitHub username (e.g., username)";
    }

    if (formData.linkedin && !/^in\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,99})$/.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid LinkedIn username (e.g., in/username)";
    }

    if (formData.mobile && !/^\+?[1-9]\d{1,14}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!isSignedIn) {
      setShowLoginPopup(true);
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (!projectId || !projectName) {
        throw new Error('Project information is missing');
      }

      const contributionData = {
        title: formData.title,
        description: formData.description,
        contributionType: formData.contributionType,
        experienceLevel: formData.experienceLevel,
        timeline: formData.timeline,
        howCanHelp: formData.howCanHelp,
        name: formData.name || 'Anonymous',
        github: formData.github || 'N/A',
        linkedin: formData.linkedin,
        mobile: formData.mobile,
        prLink: formData.prLink,
        projectId: projectId,
        projectName: decodeURIComponent(projectName),
      };

      await createProjectContribution(contributionData);
      
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
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
      }, 3000);
    } catch (error) {
      console.error('Error submitting contribution:', error);
      setIsSubmitting(false);
      // You could show an error message here
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* --- Header --- */}
        <div className="mb-12">
          <Link
            href={projectId ? `/projects/${projectId}` : "/projects"}
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to {projectName ? decodeURIComponent(projectName) : "Projects"}
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Contribute to Project
            </h1>
            {projectName && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium">
                📁 {decodeURIComponent(projectName)}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-base">
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
              <p className="text-sm font-medium text-white">
                Contribution Received
              </p>
              <p className="text-xs text-zinc-400">
                Thank you for your contribution. We'll review it soon.
              </p>
            </div>
          </div>
        )}

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Group 1: Contributor Details (Restored) */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Contributor Details{" "}
              <span className="text-zinc-600 font-normal ml-1">(Optional)</span>
            </h3>

            <div className="space-y-5">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>GitHub</Label>
                  <div className="relative">
                    <Github className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <Input
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="pl-11"
                      error={errors.github}
                    />
                  </div>
                </div>
                <div>
                  <Label>LinkedIn</Label>
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

              {/* Mobile No with Privacy Note */}
              <div>
                <Label>Mobile No <span className="text-zinc-600 font-normal ml-1">(Optional)</span></Label>
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
                  <p className="text-xs">
                    Your number is protected and will{" "}
                    <span className="text-zinc-400 font-medium">
                      never be shared
                    </span>{" "}
                    with anyone.
                  </p>
                </div>
              </div>

              {/* PR Link */}
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
            </div>
          </div>

          {/* Group 2: Contribution Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Contribution Details
            </h3>

            {/* Contribution Title */}
            <div>
              <Label>Contribution Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Fix login bug on mobile devices"
                required
                error={errors.title}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
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

            {/* How You Can Help */}
            <div>
              <Label>How You Can Help</Label>
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

            {/* Contribution Type */}
            <div className={`flex flex-col ${errors.contributionType ? "gap-2" : ""}`}>
              <Label>Contribution Type</Label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${
                    errors.contributionType
                      ? "border-red-500 focus:ring-red-500/20 hover:border-red-500"
                      : "border-zinc-800 focus:ring-zinc-700"
                  }`}
                >
                  <span
                    className={
                      formData.contributionType
                        ? "text-white"
                        : "text-zinc-600"
                    }
                  >
                    {formData.contributionType || "Select contribution type"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                  {contributionTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() =>
                        handleSelectChange("contributionType", type)
                      }
                      className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.contributionType === type ? "bg-zinc-800 text-white" : ""}`}
                    >
                      {type}
                      {formData.contributionType === type && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.contributionType && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.contributionType}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div className={`flex flex-col ${errors.experienceLevel ? "gap-2" : ""}`}>
              <Label>Experience Level</Label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${
                    errors.experienceLevel
                      ? "border-red-500 focus:ring-red-500/20 hover:border-red-500"
                      : "border-zinc-800 focus:ring-zinc-700"
                  }`}
                >
                  <span
                    className={
                      formData.experienceLevel
                        ? "text-white"
                        : "text-zinc-600"
                    }
                  >
                    {formData.experienceLevel || "Select experience level"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                  {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
                    <DropdownMenuItem
                      key={level}
                      onClick={() =>
                        handleSelectChange("experienceLevel", level)
                      }
                      className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.experienceLevel === level ? "bg-zinc-800 text-white" : ""}`}
                    >
                      {level}
                      {formData.experienceLevel === level && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.experienceLevel && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className={`flex flex-col ${errors.timeline ? "gap-2" : ""}`}>
              <Label>Timeline</Label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${
                    errors.timeline
                      ? "border-red-500 focus:ring-red-500/20 hover:border-red-500"
                      : "border-zinc-800 focus:ring-zinc-700"
                  }`}
                >
                  <span
                    className={
                      formData.timeline
                        ? "text-white"
                        : "text-zinc-600"
                    }
                  >
                    {formData.timeline || "Select timeline"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                  {["Immediate", "1-2 weeks", "2-4 weeks", "1-2 months", "2+ months"].map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() =>
                        handleSelectChange("timeline", time)
                      }
                      className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.timeline === time ? "bg-zinc-800 text-white" : ""}`}
                    >
                      {time}
                      {formData.timeline === time && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.timeline && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.timeline}
                </p>
              )}
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
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to submit your contribution and join our community."
      />
    </div>
  );
}

// Export with Suspense wrapper
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

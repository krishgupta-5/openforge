"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
  Lightbulb,
  User,
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
import { createProjectFeature } from "@/lib/firebase";
import { getUserData } from "@/lib/createUser";
import LoginPopup from "@/components/LoginPopup";

// --- Custom UI Components (Matched exactly to ContributionForm) ---

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
      // FIX: text-base on mobile prevents iOS zoom
      className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-zinc-700 ${
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

function FeatureIdeaPageWrapper() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const projectName = searchParams.get('projectName');
  const { user, isSignedIn } = useUser();

  return <FeatureIdeaPage projectId={projectId} projectName={projectName} user={user} isSignedIn={isSignedIn} />;
}

function FeatureIdeaPage({ projectId, projectName, user, isSignedIn }: { projectId: string | null, projectName: string | null, user: any, isSignedIn: boolean | undefined }) {
  
  const [formData, setFormData] = useState({
    name: "",
    github: "",
    linkedin: "",
    title: "",
    description: "",
    category: "",
    difficulty: "",
    solution: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Feature title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.solution.trim()) {
      newErrors.solution = "Solution details are required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.difficulty) {
      newErrors.difficulty = "Please select a difficulty level";
    }

    // Optional validations
    if (formData.github && !/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38})$/.test(formData.github)) {
      newErrors.github = "Please enter a valid GitHub username";
    }
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,99})\/?$/.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
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
      if (!projectId || !projectName) {
        throw new Error('Project information is missing');
      }

      const featureData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        solution: formData.solution,
        name: formData.name || 'Anonymous',
        github: formData.github || 'N/A',
        linkedin: formData.linkedin,
        email: user?.primaryEmailAddress?.emailAddress || 'your@email.com',
        userId: user?.id || '',
        projectId: projectId,
        projectName: decodeURIComponent(projectName),
      };

      await createProjectFeature(featureData);
      
      try {
        if (user?.primaryEmailAddress?.emailAddress) {
          const response = await fetch('/api/send-feature-submission-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.primaryEmailAddress.emailAddress,
              type: 'submission',
              data: {
                name: formData.name || 'Anonymous',
                projectName: decodeURIComponent(projectName),
                title: formData.title,
                category: formData.category,
                difficulty: formData.difficulty,
              },
            }),
          });
        }
      } catch (emailError) {
        console.error('Error sending submission email:', emailError);
      }
      
      setIsSubmitted(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "", github: "", linkedin: "", title: "", description: "",
          category: "", difficulty: "", solution: "",
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feature:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      {/* FIX: Increased top padding to pt-32 on mobile to clear floating navbar */}
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-12 md:px-6 md:py-24">
        
        {/* --- Header --- */}
        <div className="mb-12">
          <Link
            href={projectId ? `/projects/${projectId}` : "/projects"}
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to {projectName ? decodeURIComponent(projectName) : "Projects"}
          </Link>

          {/* FIX: Perfect Alignment Layout */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center mb-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white shrink-0">
              New Feature Proposal
            </h1>
            {projectName && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium">
                📁 {decodeURIComponent(projectName)}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            {projectName 
              ? `Suggest a new feature for ${decodeURIComponent(projectName)}.`
              : "Submit a request to improve our platform."}
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
                Proposal Received
              </p>
              <p className="text-xs text-zinc-400">
                Thank you for your contribution. We'll review it soon.
              </p>
            </div>
          </div>
        )}

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Group 1: Feature Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Feature Information
            </h3>

            <div>
              <Label>Feature Title <span className="text-red-500">*</span></Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Dark Mode for Dashboard"
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
                placeholder="Briefly describe the feature and what problem it solves"
                rows={3}
                required
                error={errors.description}
              />
            </div>

            <div>
              <Label>Proposed Solution <span className="text-red-500">*</span></Label>
              <Textarea
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                placeholder="High-level overview of how the feature should work and implementation details"
                rows={6}
                required
                error={errors.solution}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category Dropdown */}
              <div className="flex flex-col">
                <Label>Category <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${
                      errors.category ? "border-red-500" : "border-zinc-800"
                    }`}
                  >
                    <span
                      className={
                        formData.category
                          ? "text-white"
                          : "text-zinc-600"
                      }
                    >
                      {formData.category || "Select category"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                    {[
                      "UI / UX",
                      "Functionality",
                      "Performance",
                      "Security",
                      "Integration",
                      "Enhancement",
                    ].map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() =>
                          handleSelectChange("category", category)
                        }
                        className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.category === category ? "bg-zinc-800 text-white" : ""}`}
                      >
                        {category}
                        {formData.category === category && (
                          <Check className="w-3 h-3 ml-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.category && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Difficulty Dropdown */}
              <div className="flex flex-col">
                <Label>Difficulty <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`w-full bg-[#09090b] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all flex items-center justify-between group ${
                      errors.difficulty ? "border-red-500" : "border-zinc-800"
                    }`}
                  >
                    <span
                      className={
                        formData.difficulty ? "text-white" : "text-zinc-600"
                      }
                    >
                      {formData.difficulty || "Select difficulty"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                    {["Beginner", "Intermediate", "Advanced", "Expert"].map((difficulty) => (
                      <DropdownMenuItem
                        key={difficulty}
                        onClick={() =>
                          handleSelectChange("difficulty", difficulty)
                        }
                        className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.difficulty === difficulty ? "bg-zinc-800 text-white" : ""}`}
                      >
                        {difficulty}
                        {formData.difficulty === difficulty && (
                          <Check className="w-3 h-3 ml-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.difficulty && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.difficulty}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Group 2: Contributor Details */}
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
                      placeholder="username"
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
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black text-sm font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" />
                Submit Feature Proposal
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to submit your feature proposal and contribute to our community."
      />
    </div>
  );
}

// Export with Suspense wrapper
export default function FeatureIdeaForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <FeatureIdeaPageWrapper />
    </Suspense>
  );
}
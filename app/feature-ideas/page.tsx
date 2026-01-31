"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
  Lightbulb,
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

export default function FeatureIdeaPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const projectName = searchParams.get('projectName');
  const { user, isSignedIn } = useUser();
  
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

    // Feature Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Feature title is required";
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

    // Solution validation
    if (!formData.solution.trim()) {
      newErrors.solution = "Solution details are required";
    } else if (formData.solution.trim().length < 20) {
      newErrors.solution = "Solution must be at least 20 characters";
    } else if (formData.solution.trim().length > 1000) {
      newErrors.solution = "Solution must be less than 1000 characters";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // Difficulty validation
    if (!formData.difficulty) {
      newErrors.difficulty = "Please select a difficulty level";
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

      const featureData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        solution: formData.solution,
        name: formData.name || 'Anonymous',
        github: formData.github || 'N/A',
        linkedin: formData.linkedin,
        projectId: projectId,
        projectName: decodeURIComponent(projectName),
      };

      await createProjectFeature(featureData);
      
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          github: "",
          linkedin: "",
          title: "",
          description: "",
          category: "",
          difficulty: "",
          solution: "",
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feature:', error);
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
              New Feature Proposal
            </h1>
            {projectName && (
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium">
                📁 {decodeURIComponent(projectName)}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-base">
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
                Thank you for your contribution.
              </p>
            </div>
          </div>
        )}

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Group 1: Contributor Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Contributor Details{" "}
              <span className="text-zinc-600 font-normal ml-1">(Optional)</span>
            </h3>

            <div className="space-y-5">
              <div>
                <Label>Full Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  error={errors.name}
                />
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
            </div>
          </div>

          {/* Group 2: Feature Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Feature Information
            </h3>

            <div className="space-y-6">
              <div>
                <Label>Feature Title</Label>
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
                <Label>Description</Label>
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
                <Label>Proposed Solution</Label>
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
                  <Label>Category</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group"
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
                  <Label>Difficulty</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group"
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
          </div>
        </div>
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

"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
  Lock,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createIdea } from "@/lib/firebase";
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
  readOnly,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all hover:border-zinc-700 ${
      readOnly ? "opacity-60 cursor-not-allowed bg-zinc-900/50" : ""
    } ${className}`}
    readOnly={readOnly}
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

export default function ShareIdeaPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    // User Details
    name: "", // Will be set from user data
    github: "",
    linkedin: "",
    mobile: "",
    
    // Contribution Context
    helpContext: "",
    
    // Project Context
    projectTitle: "",
    problem: "",
    solution: "",
    category: "",
    difficulty: "",
    lookingFor: "",
    leadProject: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Set user name when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.username || user.emailAddresses[0]?.emailAddress || "User";
      
      setFormData(prev => ({
        ...prev,
        name: userName
      }));
    }
  }, [user]);

  // --- Dropdown Options ---
  const categories = ["Web App", "Mobile App", "AI / ML", "Tool / Library", "Hardware", "Other"];
  const difficulties = ["Beginner Friendly", "Intermediate", "Advanced"];
  const lookingForRoles = ["Frontend Developers", "Backend Developers", "Full Stack", "Designers", "AI Engineers", "All Roles"];

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = 
    formData.github && 
    formData.helpContext && 
    formData.projectTitle && 
    formData.problem && 
    formData.solution && 
    formData.category && 
    formData.difficulty && 
    formData.lookingFor;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);

    try {
      // Save to Firebase
      await createIdea({
        name: formData.name,
        github: formData.github,
        linkedin: formData.linkedin,
        mobile: formData.mobile,
        helpContext: formData.helpContext,
        title: formData.projectTitle,
        problem: formData.problem,
        solution: formData.solution,
        category: formData.category,
        difficulty: formData.difficulty,
        lookingFor: formData.lookingFor,
        leadProject: formData.leadProject,
      });

      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset
      setTimeout(() => {
        setIsSubmitted(false);
        // Reset only non-user fields
        setFormData((prev) => ({
          ...prev,
          github: "",
          linkedin: "",
          mobile: "",
          helpContext: "",
          projectTitle: "",
          problem: "",
          solution: "",
          category: "",
          difficulty: "",
          lookingFor: "",
          leadProject: false,
        }));
      }, 3000);
    } catch (error) {
      console.error('Error submitting idea:', error);
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
                href="/ideas"
                className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Ideas
              </Link>

              <h1 className="text-3xl font-bold tracking-tight text-white mb-3 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Share an Idea
              </h1>
              <p className="text-zinc-400 text-base">
                Propose a new project to the community and find collaborators.
              </p>
            </div>

        {/* --- Success Toast --- */}
        {isSubmitted && (
          <div className="mb-10 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Idea Submitted Successfully</p>
              <p className="text-xs text-zinc-400">Your idea is now pending admin review and will appear on the Ideas board once approved.</p>
            </div>
          </div>
        )}

        {/* --- Notification Info --- */}
        <div className="mb-10 p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                📧 We'll Notify You When Partners Are Found
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Once your idea is approved, we'll actively match you with potential collaborators. 
                <span className="text-blue-400 font-medium"> You'll receive email notifications as soon as we find suitable partners</span> for your project, 
                so you won't have to worry about your idea being overlooked.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>No need to keep checking back - we'll email you when there are updates!</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-12">

          {/* SECTION 1: USER DETAILS */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              User Details
            </h3>
            
            <div className="space-y-5">
              {/* Name (Auto-filled) */}
              <div>
                <Label>Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <Input
                    name="name"
                    value={formData.name}
                    readOnly
                    className="pl-11 text-zinc-400"
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
                    placeholder="username"
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LinkedIn */}
                <div>
                  <Label>LinkedIn <span className="text-zinc-600 font-normal ml-1">(Optional)</span></Label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Mobile No */}
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
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    For collaboration coordination (optional)
                  </p>
                </div>
              </div>

              {/* Helper Text */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded-md border border-zinc-800/50">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Contact info is only shared with project collaborators if you approve.</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTRIBUTION CONTEXT */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Contribution Context
            </h3>

            <div>
              <Label>How will you help on this project? <span className="text-red-500">*</span></Label>
              <Textarea
                name="helpContext"
                value={formData.helpContext}
                onChange={handleInputChange}
                placeholder="I will lead the backend architecture and set up the database..."
                rows={2}
                required
              />
              <p className="text-xs text-zinc-600 mt-2">Briefly describe your role (1-2 lines).</p>
            </div>
          </div>

          {/* SECTION 3: PROJECT CONTEXT */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-200 pb-4 border-b border-zinc-900">
              Project Context
            </h3>

            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <Label>Project Title <span className="text-red-500">*</span></Label>
                <Input
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. AI Study Planner"
                  required
                />
              </div>

              {/* Problem */}
              <div>
                <Label>Problem Statement <span className="text-red-500">*</span></Label>
                <Textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  placeholder="What problem are you solving?"
                  rows={3}
                  required
                />
              </div>

              {/* Solution */}
              <div>
                <Label>Proposed Solution <span className="text-red-500">*</span></Label>
                <Textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  placeholder="How does your project solve this?"
                  rows={4}
                  required
                />
              </div>

              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Category */}
                <div className="flex flex-col">
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group">
                      <span className={formData.category ? "text-white" : "text-zinc-600"}>
                        {formData.category || "Select Category"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                      {categories.map((cat) => (
                        <DropdownMenuItem key={cat} onClick={() => handleSelectChange("category", cat)} className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.category === cat ? "bg-zinc-800 text-white" : ""}`}>
                          {cat}
                          {formData.category === cat && <Check className="w-3 h-3 ml-auto" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col">
                  <Label>Difficulty <span className="text-red-500">*</span></Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group">
                      <span className={formData.difficulty ? "text-white" : "text-zinc-600"}>
                        {formData.difficulty || "Select Difficulty"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                      {difficulties.map((diff) => (
                        <DropdownMenuItem key={diff} onClick={() => handleSelectChange("difficulty", diff)} className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.difficulty === diff ? "bg-zinc-800 text-white" : ""}`}>
                          {diff}
                          {formData.difficulty === diff && <Check className="w-3 h-3 ml-auto" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                    {/* Looking For */}
                <div className="flex flex-col sm:col-span-2">
                  <Label>Looking For <span className="text-red-500">*</span></Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group">
                      <span className={formData.lookingFor ? "text-white" : "text-zinc-600"}>
                        {formData.lookingFor || "Who do you need?"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                      {lookingForRoles.map((role) => (
                        <DropdownMenuItem key={role} onClick={() => handleSelectChange("lookingFor", role)} className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.lookingFor === role ? "bg-zinc-800 text-white" : ""}`}>
                          {role}
                          {formData.lookingFor === role && <Check className="w-3 h-3 ml-auto" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: ACTIONS */}
          <div className="pt-4">
             {/* Lead Project Checkbox */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, leadProject: !prev.leadProject }))}
              className={`group flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 mb-8 ${
                formData.leadProject 
                  ? "bg-zinc-900 border-zinc-700" 
                  : "bg-transparent border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shadow-sm ${
                formData.leadProject 
                  ? "bg-white border-white text-black" 
                  : "bg-[#09090b] border-zinc-700 group-hover:border-zinc-500"
              }`}>
                {formData.leadProject && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </div>
              
              <div className="flex flex-col select-none">
                <span className={`text-sm font-medium transition-colors ${
                  formData.leadProject ? "text-white" : "text-zinc-300"
                }`}>
                  I want to lead this project
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-white text-black text-sm font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Idea...
                </>
              ) : (
                "Publish Idea"
              )}
            </button>
          </div>

        </form>
      </div>
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to share your idea and collaborate with our community."
      />
    </div>
  );
}

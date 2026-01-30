"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function FeatureIdeaPage() {
  const [formData, setFormData] = useState({
    name: "",
    github: "",
    linkedin: "",
    featureTitle: "",
    problem: "",
    featureDescription: "",
    featureType: "",
    priority: "",
    wantToWorkOn: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock Submission
    setTimeout(() => {
      console.log("Submitted:", formData);
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData((prev) => ({
          ...prev,
          featureTitle: "",
          problem: "",
          featureDescription: "",
          featureType: "",
          priority: "",
        }));
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* --- Header --- */}
        <div className="mb-12">
          <Link
            href="/projects/notesbuddy"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Project
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            New Feature Proposal
          </h1>
          <p className="text-zinc-400 text-base">
            Submit a request to improve the NotesBuddy platform.
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
                      placeholder="username"
                      className="pl-11"
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
                      placeholder="in/username"
                      className="pl-11"
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
                  name="featureTitle"
                  value={formData.featureTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Dark Mode for Dashboard"
                  required
                />
              </div>

              <div>
                <Label>Problem Statement</Label>
                <Textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the issue this feature solves (1-2 lines)"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  name="featureDescription"
                  value={formData.featureDescription}
                  onChange={handleInputChange}
                  placeholder="High-level overview of how the feature should work"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Type Dropdown */}
                <div className="flex flex-col">
                  <Label>Type</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div
                        className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span
                          className={
                            formData.featureType
                              ? "text-white"
                              : "text-zinc-600"
                          }
                        >
                          {formData.featureType || "Select type"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                      {[
                        "UI / UX",
                        "Functionality",
                        "Performance",
                        "Enhancement",
                      ].map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() =>
                            handleSelectChange("featureType", type)
                          }
                          className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.featureType === type ? "bg-zinc-800 text-white" : ""}`}
                        >
                          {type}
                          {formData.featureType === type && (
                            <Check className="w-3 h-3 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Priority Dropdown */}
                <div className="flex flex-col">
                  <Label>Priority</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div
                        className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-left hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span
                          className={
                            formData.priority 
                              ? formData.priority === "High" 
                                ? "text-white font-bold"
                                : formData.priority === "Medium"
                                  ? "text-white font-semibold"
                                  : "text-white font-normal"
                              : "text-white"
                          }
                        >
                          {formData.priority || "Select priority"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#09090b] border-zinc-800 text-zinc-300">
                      {["Low", "Medium", "High"].map((priority) => (
                        <DropdownMenuItem
                          key={priority}
                          onClick={() =>
                            handleSelectChange("priority", priority)
                          }
                          className={`cursor-pointer focus:bg-zinc-800 focus:text-white my-0.5 ${formData.priority === priority ? "bg-zinc-800 text-white" : ""}`}
                        >
                          {priority}
                          {formData.priority === priority && (
                            <Check className="w-3 h-3 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Action & Submit */}
          <div className="pt-4">
            <div
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  wantToWorkOn: !prev.wantToWorkOn,
                }))
              }
              className={`group flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                formData.wantToWorkOn
                  ? "bg-zinc-900 border-zinc-700"
                  : "bg-transparent border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shadow-sm ${
                  formData.wantToWorkOn
                    ? "bg-white border-white text-black"
                    : "bg-[#09090b] border-zinc-700 group-hover:border-zinc-500"
                }`}
              >
                {formData.wantToWorkOn && (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                )}
              </div>

              <div className="flex flex-col select-none">
                <span
                  className={`text-sm font-medium transition-colors ${
                    formData.wantToWorkOn ? "text-white" : "text-zinc-300"
                  }`}
                >
                  I want to contribute to this feature
                </span>
                <span className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Check this box if you are interested in actively building this
                  feature yourself. We will tag you on the GitHub issue.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full bg-white text-black text-sm font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Proposal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

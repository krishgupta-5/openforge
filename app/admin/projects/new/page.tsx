"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProject() {
  const { user } = useUser();
  const router = useRouter();

  if (!isAdmin(user?.emailAddresses[0].emailAddress)) {
    return <p>Access Denied</p>;
  }

  const [form, setForm] = useState<any>({});
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  useEffect(() => {
    async function loadAvailableFields() {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        if (snapshot.docs.length > 0) {
          // Get all unique field names from existing projects
          const allFields = new Set<string>();
          snapshot.docs.forEach(doc => {
            Object.keys(doc.data()).forEach(key => allFields.add(key));
          });
          setAvailableFields(Array.from(allFields).sort());
          
          // Initialize form with empty values for available fields
          const initialForm: any = {};
          allFields.forEach(field => {
            initialForm[field] = "";
          });
          setForm(initialForm);
        } else {
          // If no projects exist, show basic fields
          const basicFields = ["title", "description", "status", "category"];
          setAvailableFields(basicFields);
          const initialForm: any = {};
          basicFields.forEach(field => {
            initialForm[field] = field === "status" ? "Open for Contributions" : 
                               field === "category" ? "Working" : "";
          });
          setForm(initialForm);
        }
      } catch (error) {
        console.error("Error loading available fields:", error);
      }
    }
    loadAvailableFields();
  }, []);

  const handleSubmit = async () => {
    await addDoc(collection(db, "projects"), {
      ...form,
      technologies: form.technologies ? form.technologies.split(",").map((t: string) => t.trim()) : [],
      createdAt: new Date(),
    });
    router.push("/admin/projects");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-12">
        <div className="mb-8">
          <Link 
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Create Project
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-2xl">
            Add a new community project to the platform
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <div className="bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              {availableFields.map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  {key === "description" || key === "shortDescription" || key === "overview" || key === "whatUsersCanDo" || key === "whyIBuiltThis" || key === "impact" || key === "futurePlans" || key === "features" || key === "motivation" ? (
                    <div>
                      <textarea
                        placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors resize-none"
                        rows={key === "overview" || key === "whatUsersCanDo" || key === "whyIBuiltThis" ? 6 : 4}
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      {(key === "whatUsersCanDo" || key === "features" || key === "motivation" || key === "impact" || key === "futurePlans") && (
                        <p className="text-xs text-zinc-500 mt-2">
                          Use bullet points or numbered lists. Each point on a new line.
                        </p>
                      )}
                    </div>
                  ) : key === "technologies" || key === "techStack" ? (
                    <div>
                      <input
                        type="text"
                        placeholder={key === "technologies" ? "React, TypeScript, Tailwind CSS (comma-separated)" : "React, TypeScript, Next.js, Firebase (comma-separated)"}
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500 mt-2">
                        Enter technologies separated by commas
                      </p>
                    </div>
                  ) : key === "mockupImage" ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="e.g., notesbuddy.png"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500">
                        Place your image in /public/mockups/ folder and enter the filename here
                      </p>
                      {form[key] && (
                        <div className="mt-2 p-3 bg-neutral-900/30 border border-white/5 rounded-lg">
                          <p className="text-xs text-zinc-400 mb-2">Preview:</p>
                          <img 
                            src={`/mockups/${form[key]}`} 
                            alt="Mockup preview" 
                            className="w-full h-32 object-cover rounded border border-white/10"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-8">
          <Link 
            href="/admin/projects"
            className="px-6 py-3 bg-neutral-900/40 border border-white/5 text-white text-sm font-medium hover:bg-neutral-900/60 transition-colors rounded-lg"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

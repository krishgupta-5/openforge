"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Play } from "lucide-react";

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
          
          // Always include videoUrl and previewImages in available fields
          allFields.add("videoUrl");
          allFields.add("previewImages");
          
          // Define logical order for fields
          const fieldOrder = [
            "title", "shortDescription", "status", "timeline", "role", "team", 
            "technologies", "techStack", "githubUrl", "liveUrl", "previewImages", "videoUrl", "mockupImage", "overview", 
            "features", "whatUsersCanDo", "whyIBuiltThis", "impact", 
            "futurePlans"
          ];
          
          // Order fields: first the predefined ones in order, then any additional ones alphabetically
          const orderedFields = [
            ...fieldOrder.filter(field => allFields.has(field)),
            ...Array.from(allFields).filter(field => !fieldOrder.includes(field)).sort()
          ];
          setAvailableFields(orderedFields);
          
          // Initialize form with empty values for available fields
          const initialForm: any = {};
          orderedFields.forEach(field => {
            initialForm[field] = "";
          });
          setForm(initialForm);
        } else {
          // No existing projects, use default fields
          const defaultFields = [
            "title", "shortDescription", "status", "timeline", "role", "team", 
            "technologies", "techStack", "githubUrl", "liveUrl", "previewImages", "videoUrl", "mockupImage", "overview", 
            "features", "whatUsersCanDo", "whyIBuiltThis", "impact", 
            "futurePlans"
          ];
          setAvailableFields(defaultFields);
          
          // Initialize form with empty values for default fields
          const initialForm: any = {};
          defaultFields.forEach(field => {
            initialForm[field] = "";
          });
          setForm(initialForm);
        }
      } catch (error) {
        console.error("Error loading available fields:", error);
      }
    }
    loadAvailableFields();
  }, []);

  // Auto-bullet functionality for textareas
  const handleTextareaChange = (key: string, value: string) => {
    // Check if the last action was pressing Enter
    const lines = value.split('\n');
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      const secondLastLine = lines[lines.length - 2];
      
      // If the previous line was a bullet point and the new line is empty, add a bullet
      if (lastLine === '' && (secondLastLine.startsWith('•') || secondLastLine.startsWith('-') || /^\d+\./.test(secondLastLine))) {
        // Extract the bullet style from the previous line
        let bullet = '• ';
        if (secondLastLine.startsWith('-')) {
          bullet = '- ';
        } else if (/^\d+\./.test(secondLastLine)) {
          const match = secondLastLine.match(/^(\d+)\./);
          if (match) {
            const nextNumber = parseInt(match[1]) + 1;
            bullet = `${nextNumber}. `;
          }
        }
        
        // Add bullet to the new line
        lines[lines.length - 1] = bullet;
        value = lines.join('\n');
      }
    }
    
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      // Create the project document first
      const docRef = await addDoc(collection(db, "projects"), {
        ...form,
        technologies: form.technologies ? form.technologies.split(",").map((t: string) => t.trim()) : [],
        createdAt: new Date(),
      });

      // Update the document to include its own ID
      await updateDoc(docRef, {
        id: docRef.id
      });

      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
    }
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
                  {key === "description" || key === "shortDescription" || key === "overview" || key === "whatUsersCanDo" || key === "whyIBuiltThis" || key === "impact" || key === "futurePlans" || key === "features" ? (
                    <div>
                      <MarkdownEditor
                        value={form[key] || ""}
                        onChange={(value) => setForm({ ...form, [key]: value })}
                        placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        height={key === "overview" || key === "whatUsersCanDo" || key === "whyIBuiltThis" ? "300px" : "200px"}
                      />
                      {(key === "whatUsersCanDo" || key === "features" || key === "impact" || key === "futurePlans") && (
                        <p className="text-xs text-zinc-500 mt-2">
                          Use markdown formatting. Supports headings, lists, links, code blocks, and more.
                        </p>
                      )}
                    </div>
                  ) : key === "technologies" || key === "techStack" ? (
                    <div>
                      <input
                        type="text"
                        placeholder={key === "technologies" ? "React, TypeScript, Tailwind CSS (for logo display)" : key === "techStack" ? "React, TypeScript, Next.js, Firebase (comma-separated)" : "React, TypeScript, Next.js, Firebase (comma-separated)"}
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500 mt-2">
                        {key === "technologies" ? "Enter technologies for logo display (supports React, TypeScript, Next.js, etc.)" : "Enter technologies separated by commas"}
                      </p>
                    </div>
                  ) : key === "timeline" ? (
                    <div>
                      <input
                        type="text"
                        placeholder="e.g., 2 months, 3 weeks, 6 months"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500 mt-2">
                        Duration of the project
                      </p>
                    </div>
                  ) : key === "role" ? (
                    <div>
                      <select
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      >
                        <option value="">Select role</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="UI/UX">UI/UX</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                      <p className="text-xs text-zinc-500 mt-2">
                        Your primary role in the project
                      </p>
                    </div>
                  ) : key === "team" ? (
                    <div>
                      <select
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      >
                        <option value="">Select team size</option>
                        <option value="Solo">Solo</option>
                        <option value="2-3 people">2-3 people</option>
                        <option value="4-6 people">4-6 people</option>
                        <option value="7-10 people">7-10 people</option>
                        <option value="10+ people">10+ people</option>
                      </select>
                      <p className="text-xs text-zinc-500 mt-2">
                        Team size for the project
                      </p>
                    </div>
                  ) : key === "githubUrl" ? (
                    <div>
                      <input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500 mt-2">
                        GitHub repository URL
                      </p>
                    </div>
                  ) : key === "liveUrl" ? (
                    <div>
                      <input
                        type="url"
                        placeholder="https://your-project-url.com"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500 mt-2">
                        Live demo URL (optional)
                      </p>
                    </div>
                  ) : key === "previewImages" ? (
                    <div className="space-y-3">
                      <textarea
                        placeholder="image1.jpg,image2.png,screenshot.png"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors resize-none"
                        rows={3}
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500">
                        Enter preview images separated by commas. Place image files in /public/previews/ folder. Supported formats: jpg, png, gif.
                      </p>
                      {form[key] && (
                        <div className="mt-3 p-3 bg-neutral-900/30 border border-white/5 rounded-lg">
                          <p className="text-xs text-zinc-400 mb-2">Preview:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {form[key].split(',').map((file: string, index: number) => {
                              const filename = file.trim();
                              if (!filename) return null;
                              return (
                                <div key={index} className="relative group">
                                  <img 
                                    src={`/previews/${filename}`} 
                                    alt={`Preview ${index + 1}`} 
                                    className="w-full h-20 object-cover rounded border border-white/10"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                    <span className="text-xs text-white truncate px-1">{filename}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : key === "videoUrl" ? (
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/xyz/view?usp=sharing"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                      <p className="text-xs text-zinc-500">
                        Enter video URL (YouTube, Google Drive). This video will play when users tap on preview.
                      </p>
                      {form[key] && (
                        <div className="mt-3 p-3 bg-neutral-900/30 border border-white/5 rounded-lg">
                          <p className="text-xs text-zinc-400 mb-2">Video Preview:</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-16 bg-black/50 rounded flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-white truncate">{form[key]}</p>
                              <p className="text-xs text-zinc-400">Click to play video</p>
                            </div>
                          </div>
                        </div>
                      )}
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

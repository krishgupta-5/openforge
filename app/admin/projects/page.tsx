"use client";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "projects"));
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
              Projects
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-2xl">
              Manage community projects and contributions
            </p>
          </div>
          <Link 
            href="/admin/projects/new"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {/* Projects List */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-neutral-900/40 border border-white/5 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-zinc-400 mb-6">Get started by creating your first project</p>
            <Link 
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{p.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                          p.status?.toLowerCase().includes("open")
                            ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-950/30 border-amber-500/20 text-amber-400"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            p.status?.toLowerCase().includes("open") ? "bg-emerald-500" : "bg-amber-500"
                          }`}></div>
                          {p.status || "Active"}
                        </span>
                        {p.category && (
                          <span className="px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-xs font-medium">
                            {p.category}
                          </span>
                        )}
                        {p.version && (
                          <span className="px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-xs font-medium">
                            {p.version}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-8">
                      <Link 
                        href={`/admin/projects/${p.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button 
                        onClick={() => remove(p.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTotalViews } from "@/lib/viewTracking";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeContributors: 0,
    totalViews: 0
  });

  // Format number to display in readable format (e.g., 2.4k, 1.5M)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total projects
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const totalProjects = projectsSnapshot.size;

        // Fetch total users (contributors)
        const usersSnapshot = await getDocs(collection(db, "users"));
        const activeContributors = usersSnapshot.size;

        // Fetch total views from view tracking
        const totalViews = await getTotalViews();

        setStats({
          totalProjects,
          activeContributors,
          totalViews
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    }

    if (user && isAdmin(user.emailAddresses[0]?.emailAddress)) {
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p>You need to be signed in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  if (!isAdmin(userEmail)) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access the admin panel.</p>
          <p className="text-sm text-gray-400 mt-2">Signed in as: {userEmail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-2xl">
            Manage community projects and platform settings
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{formatNumber(stats.totalProjects)}</h3>
            <p className="text-zinc-400">Total Projects</p>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{formatNumber(stats.activeContributors)}</h3>
            <p className="text-zinc-400">Active Contributors</p>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{formatNumber(stats.totalViews)}</h3>
            <p className="text-zinc-400">Total Views</p>
          </div>
        </div>
        
        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link 
            href="/admin/projects"
            className="group flex flex-col bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            <div className="p-8">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Projects</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">Manage community projects, add new ones, and update existing content</p>
            </div>
            <div className="px-8 pb-8">
              <div className="flex items-center text-emerald-500 text-sm font-medium group-hover:text-emerald-400 transition-colors">
                Manage Projects
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
          
          <div className="group flex flex-col bg-neutral-900/20 border border-white/5 rounded-xl overflow-hidden opacity-50 cursor-not-allowed">
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Users</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">Manage user accounts and permissions</p>
            </div>
            <div className="px-8 pb-8">
              <div className="flex items-center text-zinc-500 text-sm font-medium">
                Coming Soon
              </div>
            </div>
          </div>
          
          <div className="group flex flex-col bg-neutral-900/20 border border-white/5 rounded-xl overflow-hidden opacity-50 cursor-not-allowed">
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Analytics</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">View platform analytics and insights</p>
            </div>
            <div className="px-8 pb-8">
              <div className="flex items-center text-zinc-500 text-sm font-medium">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="mt-16 p-6 bg-neutral-900/20 border border-white/5 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Logged in as Administrator</p>
              <p className="text-white font-medium">{userEmail}</p>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
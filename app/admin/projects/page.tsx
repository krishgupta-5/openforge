"use client";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProjectFeatures, updateProjectFeatureStatus, deleteProjectFeature, ProjectFeature } from "@/lib/firebase";
import { getProjectContributions, updateProjectContributionStatus, deleteProjectContribution, ProjectContribution } from "@/lib/firebase";
import {
  Check,
  X,
  Eye,
  Trash2,
  Clock,
  Calendar,
  User,
  Github,
  ChevronDown,
  Filter,
  RefreshCw,
  Lightbulb,
  GitPullRequest,
  Layout,
  Layers,
  Activity,
  AlertCircle,
  ArrowLeft,
  Linkedin,
  Phone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<ProjectFeature[]>([]);
  const [contributions, setContributions] = useState<ProjectContribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<ProjectContribution[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'features' | 'contributions'>('projects');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedFeature, setSelectedFeature] = useState<ProjectFeature | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<ProjectContribution | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "projects"));
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
    fetchFeatures();
    fetchContributions();
  }, []);

  useEffect(() => {
    filterFeatures();
    filterContributions();
  }, [features, contributions, statusFilter]);

  const fetchFeatures = async () => {
    try {
      const fetchedFeatures = await getProjectFeatures();
      setFeatures(fetchedFeatures);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const fetchContributions = async () => {
    try {
      const fetchedContributions = await getProjectContributions();
      setContributions(fetchedContributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  };

  const filterFeatures = () => {
    if (statusFilter === 'all') {
      setFilteredFeatures(features);
    } else {
      setFilteredFeatures(features.filter(feature => feature.status === statusFilter));
    }
  };

  const filterContributions = () => {
    if (statusFilter === 'all') {
      setFilteredContributions(contributions);
    } else {
      setFilteredContributions(contributions.filter(contribution => contribution.status === statusFilter));
    }
  };

  const handleFeatureStatusUpdate = async (featureId: string, status: 'approved' | 'rejected') => {
    setActionLoading(featureId);
    try {
      await updateProjectFeatureStatus(featureId, status);
      await fetchFeatures();
    } catch (error) {
      console.error('Error updating feature status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    
    setActionLoading(featureId);
    try {
      await deleteProjectFeature(featureId);
      await fetchFeatures();
    } catch (error) {
      console.error('Error deleting feature:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleContributionStatusUpdate = async (contributionId: string, status: 'approved' | 'rejected') => {
    setActionLoading(contributionId);
    try {
      await updateProjectContributionStatus(contributionId, status);
      await fetchContributions();
    } catch (error) {
      console.error('Error updating contribution status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContribution = async (contributionId: string) => {
    if (!confirm('Are you sure you want to delete this contribution?')) return;
    
    setActionLoading(contributionId);
    try {
      await deleteProjectContribution(contributionId);
      await fetchContributions();
    } catch (error) {
      console.error('Error deleting contribution:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 ring-yellow-500/20';
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 ring-zinc-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'approved':
        return <Check className="w-3.5 h-3.5" />;
      case 'rejected':
        return <X className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter(p => p.id !== id));
  };

  // Helper component for stats cards
  const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex items-start justify-between hover:border-white/10 transition-colors">
      <div>
        <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
        <h3 className={`text-2xl font-bold tracking-tight ${color}`}>{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon className="w-5 h-5 opacity-80" />
      </div>
    </div>
  );

  return (
    // Added pt-20 to push content down from fixed navbar
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 pt-20">
      
      {/* Header Section */}
      {/* Changed top-0 to top-14 to stick BELOW the navbar, not behind it */}
      <div className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                Project Dashboard
              </h1>
              <p className="text-zinc-400 font-light flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                Overview of community projects and contributions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-all rounded-lg border border-white/5 hover:border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              {activeTab === 'projects' && (
                <Link 
                  href="/admin/projects/new"
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all rounded-lg shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_-3px_rgba(255,255,255,0.4)]"
                >
                  <Layout className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  New Project
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-8 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <Layout className="w-4 h-4" />
              Projects
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Features
              {features.filter(f => f.status === 'pending').length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-md border border-yellow-500/20">
                  {features.filter(f => f.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'contributions'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              Contributions
              {contributions.filter(c => c.status === 'pending').length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-md border border-yellow-500/20">
                  {contributions.filter(c => c.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* Changed pt-32 to py-8 to reduce the massive gap */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'projects' ? (
          /* Projects List */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {projects.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Layout className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
                <p className="text-zinc-500 mb-6 max-w-sm mx-auto">Get started by creating your first project to track features and contributions.</p>
                <Link 
                  href="/admin/projects/new"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold hover:bg-emerald-500/20 transition-all rounded-lg"
                >
                  <Layout className="w-4 h-4" />
                  Create Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projects.map((p, index) => (
                  <div key={p.id || `project-${index}`} className="group bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-300 shadow-sm">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between md:justify-start gap-4">
                            <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              p.status?.toLowerCase().includes("open")
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                p.status?.toLowerCase().includes("open") ? "bg-emerald-500" : "bg-amber-500"
                              }`}/>
                              {p.status || "Active"}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">{p.description}</p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {p.category && (
                              <span className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-medium">
                                {p.category}
                              </span>
                            )}
                            {p.version && (
                              <span className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-medium font-mono">
                                v{p.version}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 md:pt-0">
                          <Link 
                            href={`/admin/projects/${p.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors rounded-lg border border-white/5 hover:border-white/10"
                          >
                            <Layers className="w-4 h-4" />
                            Manage
                          </Link>
                          <button 
                            onClick={() => remove(p.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium transition-colors rounded-lg border border-red-500/10"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'features' ? (
          /* Features List */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Features Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Features" value={features.length} color="text-white" icon={Layers} />
              <StatCard title="Pending Review" value={features.filter(f => f.status === 'pending').length} color="text-yellow-400" icon={Clock} />
              <StatCard title="Approved" value={features.filter(f => f.status === 'approved').length} color="text-emerald-400" icon={Check} />
              <StatCard title="Rejected" value={features.filter(f => f.status === 'rejected').length} color="text-red-400" icon={X} />
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-zinc-900/30 border border-white/5 p-2 rounded-xl backdrop-blur-sm">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-all text-sm font-medium border border-white/5">
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800 min-w-[150px]">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')} className="focus:bg-zinc-800 focus:text-white text-zinc-400 cursor-pointer">All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')} className="focus:bg-zinc-800 focus:text-yellow-400 text-zinc-400 cursor-pointer">Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')} className="focus:bg-zinc-800 focus:text-emerald-400 text-zinc-400 cursor-pointer">Approved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')} className="focus:bg-zinc-800 focus:text-red-400 text-zinc-400 cursor-pointer">Rejected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={fetchFeatures}
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Features List */}
            {filteredFeatures.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <Lightbulb className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No features matching filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeatures.map((feature, index) => (
                  <div key={feature.id || `feature-${index}`} className="group bg-zinc-900/30 border border-white/5 rounded-xl p-5 hover:border-zinc-700/50 hover:bg-zinc-900/40 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-white truncate">{feature.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-bold border ring-1 ring-inset ${getStatusColor(feature.status)}`}>
                            {getStatusIcon(feature.status)}
                            {feature.status}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">{feature.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                           <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded">
                             <User className="w-3 h-3" />
                             {feature.name}
                           </div>
                           <div className="flex items-center gap-1.5">
                             <Github className="w-3 h-3" />
                             {feature.github}
                           </div>
                           <div className="flex items-center gap-1.5">
                             <Calendar className="w-3 h-3" />
                             {formatDate(feature.createdAt)}
                           </div>
                           <span className="w-1 h-1 rounded-full bg-zinc-700" />
                           <div className="text-blue-400/80 font-medium">
                             {feature.projectName}
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <button
                          onClick={() => setSelectedFeature(feature)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {feature.status === 'pending' && (
                          <div className="flex items-center gap-1 bg-zinc-950/50 p-1 rounded-lg border border-white/5">
                            <button
                              onClick={() => handleFeatureStatusUpdate(feature.id!, 'approved')}
                              disabled={actionLoading === feature.id}
                              className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-zinc-800" />
                            <button
                              onClick={() => handleFeatureStatusUpdate(feature.id!, 'rejected')}
                              disabled={actionLoading === feature.id}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleDeleteFeature(feature.id!)}
                          disabled={actionLoading === feature.id}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'contributions' ? (
          /* Contributions List */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Contributions Stats */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Contributions" value={contributions.length} color="text-white" icon={Activity} />
              <StatCard title="Pending Review" value={contributions.filter(c => c.status === 'pending').length} color="text-yellow-400" icon={Clock} />
              <StatCard title="Approved" value={contributions.filter(c => c.status === 'approved').length} color="text-emerald-400" icon={Check} />
              <StatCard title="Rejected" value={contributions.filter(c => c.status === 'rejected').length} color="text-red-400" icon={X} />
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-zinc-900/30 border border-white/5 p-2 rounded-xl backdrop-blur-sm">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-all text-sm font-medium border border-white/5">
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800 min-w-[150px]">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')} className="focus:bg-zinc-800 focus:text-white text-zinc-400 cursor-pointer">All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')} className="focus:bg-zinc-800 focus:text-yellow-400 text-zinc-400 cursor-pointer">Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')} className="focus:bg-zinc-800 focus:text-emerald-400 text-zinc-400 cursor-pointer">Approved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')} className="focus:bg-zinc-800 focus:text-red-400 text-zinc-400 cursor-pointer">Rejected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={fetchContributions}
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Contributions List */}
            {filteredContributions.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <GitPullRequest className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No contributions matching filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContributions.map((contribution, index) => (
                  <div key={contribution.id || `contribution-${index}`} className="group bg-zinc-900/30 border border-white/5 rounded-xl p-5 hover:border-zinc-700/50 hover:bg-zinc-900/40 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-white truncate">{contribution.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-bold border ring-1 ring-inset ${getStatusColor(contribution.status)}`}>
                            {getStatusIcon(contribution.status)}
                            {contribution.status}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">{contribution.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                           <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded">
                             <User className="w-3 h-3" />
                             {contribution.name}
                           </div>
                           <div className="flex items-center gap-1.5">
                             <Github className="w-3 h-3" />
                             {contribution.github}
                           </div>
                           <div className="flex items-center gap-1.5">
                             <Calendar className="w-3 h-3" />
                             {formatDate(contribution.createdAt)}
                           </div>
                           <span className="w-1 h-1 rounded-full bg-zinc-700" />
                           <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/10">
                              {contribution.contributionType}
                           </span>
                           <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/10">
                              {contribution.experienceLevel}
                           </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <button
                          onClick={() => setSelectedContribution(contribution)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {contribution.status === 'pending' && (
                          <div className="flex items-center gap-1 bg-zinc-950/50 p-1 rounded-lg border border-white/5">
                            <button
                              onClick={() => handleContributionStatusUpdate(contribution.id!, 'approved')}
                              disabled={actionLoading === contribution.id}
                              className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-zinc-800" />
                            <button
                              onClick={() => handleContributionStatusUpdate(contribution.id!, 'rejected')}
                              disabled={actionLoading === contribution.id}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleDeleteContribution(contribution.id!)}
                          disabled={actionLoading === contribution.id}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Contribution Detail Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur border-b border-zinc-800 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedContribution.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ring-1 ring-inset ${getStatusColor(selectedContribution.status)}`}>
                      {getStatusIcon(selectedContribution.status)}
                      {selectedContribution.status}
                    </span>
                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3"/>
                      {formatDate(selectedContribution.createdAt)}
                    </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedContribution(null)}
                className="p-2 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">About</h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                      <p className="text-zinc-300 text-sm leading-relaxed">{selectedContribution.description}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">How You Can Help</h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                      <p className="text-zinc-300 text-sm leading-relaxed">{selectedContribution.howCanHelp}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Details</h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                      <div className="flex justify-between items-center py-1 border-b border-zinc-800/50 pb-2">
                        <span className="text-zinc-400 text-sm">Type</span>
                        <span className="text-blue-400 text-sm font-medium">{selectedContribution.contributionType}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-zinc-800/50 pb-2">
                         <span className="text-zinc-400 text-sm">Experience</span>
                         <span className="text-purple-400 text-sm font-medium">{selectedContribution.experienceLevel}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-zinc-800/50 pb-2">
                         <span className="text-zinc-400 text-sm">Timeline</span>
                         <span className="text-white text-sm">{selectedContribution.timeline}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                         <span className="text-zinc-400 text-sm">Project</span>
                         <span className="text-white text-sm">{selectedContribution.projectName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Contact</h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-200">{selectedContribution.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Github className="w-4 h-4 text-zinc-500" />
                        <a 
                          href={`https://github.com/${selectedContribution.github}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-zinc-200 hover:text-white hover:underline transition-colors"
                        >
                          {selectedContribution.github}
                        </a>
                      </div>
                      {selectedContribution.linkedin && (
                        <div className="flex items-center gap-3 text-sm">
                          <Linkedin className="w-4 h-4 text-zinc-500" />
                          <a 
                            href={selectedContribution.linkedin.includes('linkedin.com') ? selectedContribution.linkedin : `https://linkedin.com/in/${selectedContribution.linkedin}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-zinc-200 hover:text-white hover:underline transition-colors"
                          >
                            {selectedContribution.linkedin.includes('linkedin.com') ? selectedContribution.linkedin.split('/in/')[1] || selectedContribution.linkedin : selectedContribution.linkedin}
                          </a>
                        </div>
                      )}
                      {selectedContribution.mobile && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-zinc-500" />
                          <a 
                            href={`tel:${selectedContribution.mobile}`}
                            className="text-zinc-200 hover:text-white hover:underline transition-colors"
                          >
                            {selectedContribution.mobile}
                          </a>
                        </div>
                      )}
                      {selectedContribution.prLink && (
                        <div className="flex items-center gap-3 text-sm pt-2 mt-2 border-t border-zinc-800/50">
                          <GitPullRequest className="w-4 h-4 text-emerald-500" />
                          <a 
                            href={selectedContribution.prLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-500 hover:text-emerald-400 hover:underline truncate"
                          >
                            View Pull Request
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-900/30">
              <div className="flex gap-3">
                {selectedContribution.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => {
                        handleContributionStatusUpdate(selectedContribution.id!, 'approved');
                        setSelectedContribution(null);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg transition-colors font-medium flex justify-center items-center gap-2"
                    >
                      <Check className="w-4 h-4"/> Approve
                    </button>
                    <button
                      onClick={() => {
                        handleContributionStatusUpdate(selectedContribution.id!, 'rejected');
                        setSelectedContribution(null);
                      }}
                      className="flex-1 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 border border-zinc-700 text-white py-2.5 rounded-lg transition-all font-medium flex justify-center items-center gap-2"
                    >
                      <X className="w-4 h-4"/> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedContribution(null)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg transition-colors font-medium"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur border-b border-zinc-800 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedFeature.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ring-1 ring-inset ${getStatusColor(selectedFeature.status)}`}>
                      {getStatusIcon(selectedFeature.status)}
                      {selectedFeature.status}
                    </span>
                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3"/>
                      {formatDate(selectedFeature.createdAt)}
                    </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-2 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-6">
                 <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                      <p className="text-zinc-300 text-sm leading-relaxed">{selectedFeature.description}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Proposed Solution</h3>
                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
                      <p className="text-zinc-300 text-sm leading-relaxed">{selectedFeature.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Category</h3>
                        <p className="text-white font-medium">{selectedFeature.category}</p>
                     </div>
                     <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Difficulty</h3>
                        <p className="text-white font-medium">{selectedFeature.difficulty}</p>
                     </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Contact Info</h3>
                    <div className="flex flex-wrap gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                           <User className="w-4 h-4 text-zinc-500"/> {selectedFeature.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                           <Github className="w-4 h-4 text-zinc-500"/> {selectedFeature.github}
                        </div>
                        {selectedFeature.mobile && (
                           <div className="flex items-center gap-2 text-sm text-zinc-300">
                             <AlertCircle className="w-4 h-4 text-zinc-500"/> {selectedFeature.mobile}
                           </div>
                        )}
                    </div>
                  </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-900/30">
              <div className="flex gap-3">
                {selectedFeature.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => {
                        handleFeatureStatusUpdate(selectedFeature.id!, 'approved');
                        setSelectedFeature(null);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg transition-colors font-medium flex justify-center items-center gap-2"
                    >
                      <Check className="w-4 h-4"/> Approve
                    </button>
                    <button
                      onClick={() => {
                        handleFeatureStatusUpdate(selectedFeature.id!, 'rejected');
                        setSelectedFeature(null);
                      }}
                      className="flex-1 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 border border-zinc-700 text-white py-2.5 rounded-lg transition-all font-medium flex justify-center items-center gap-2"
                    >
                      <X className="w-4 h-4"/> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg transition-colors font-medium"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
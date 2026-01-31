"use client";

import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import Link from "next/link";
import { getIdeas, updateIdeaStatus, deleteIdea, Idea } from "@/lib/firebase";
import { useEffect, useState } from "react";
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
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminIdeasPage() {
  const { user } = useUser();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    filterIdeas();
  }, [ideas, statusFilter]);

  const fetchIdeas = async () => {
    try {
      const fetchedIdeas = await getIdeas();
      setIdeas(fetchedIdeas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIdeas = () => {
    if (statusFilter === 'all') {
      setFilteredIdeas(ideas);
    } else {
      setFilteredIdeas(ideas.filter(idea => idea.status === statusFilter));
    }
  };

  const handleStatusUpdate = async (ideaId: string, status: 'approved' | 'rejected') => {
    setActionLoading(ideaId);
    try {
      await updateIdeaStatus(ideaId, status);
      await fetchIdeas(); // Refresh the list
    } catch (error) {
      console.error('Error updating idea status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    
    setActionLoading(ideaId);
    try {
      await deleteIdea(ideaId);
      await fetchIdeas(); // Refresh the list
    } catch (error) {
      console.error('Error deleting idea:', error);
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
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'approved':
        return <Check className="w-3 h-3" />;
      case 'rejected':
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Ideas</h1>
              <p className="text-zinc-400">Review and approve community-submitted project ideas</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchIdeas}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white">{ideas.length}</h3>
              <p className="text-zinc-400 text-sm">Total Ideas</p>
            </div>
            <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
              <h3 className="text-lg font-bold text-yellow-400">{ideas.filter(i => i.status === 'pending').length}</h3>
              <p className="text-zinc-400 text-sm">Pending Review</p>
            </div>
            <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
              <h3 className="text-lg font-bold text-emerald-400">{ideas.filter(i => i.status === 'approved').length}</h3>
              <p className="text-zinc-400 text-sm">Approved</p>
            </div>
            <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
              <h3 className="text-lg font-bold text-red-400">{ideas.filter(i => i.status === 'rejected').length}</h3>
              <p className="text-zinc-400 text-sm">Rejected</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                {statusFilter === 'all' ? 'All Ideas' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem onClick={() => setStatusFilter('all')} className="hover:bg-zinc-700">
                  All Ideas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')} className="hover:bg-zinc-700">
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('approved')} className="hover:bg-zinc-700">
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('rejected')} className="hover:bg-zinc-700">
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading ideas...</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No ideas found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea) => (
              <div key={idea.id} className="bg-neutral-900/40 border border-white/5 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(idea.status)}`}>
                        {getStatusIcon(idea.status)}
                        {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{idea.problem}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {idea.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        {idea.github}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(idea.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-zinc-800 rounded text-xs">{idea.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedIdea(idea)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View Details
                  </button>
                  
                  {idea.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(idea.id!, 'approved')}
                        disabled={actionLoading === idea.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" />
                        {actionLoading === idea.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(idea.id!, 'rejected')}
                        disabled={actionLoading === idea.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                        {actionLoading === idea.id ? 'Processing...' : 'Reject'}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDelete(idea.id!)}
                    disabled={actionLoading === idea.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedIdea && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{selectedIdea.title}</h2>
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Problem Statement</h3>
                  <p className="text-zinc-300">{selectedIdea.problem}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Proposed Solution</h3>
                  <p className="text-zinc-300">{selectedIdea.solution}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Contribution Context</h3>
                  <p className="text-zinc-300">{selectedIdea.helpContext}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-2">Category</h3>
                    <p className="text-zinc-300">{selectedIdea.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-2">Difficulty</h3>
                    <p className="text-zinc-300">{selectedIdea.difficulty}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Looking For</h3>
                  <p className="text-zinc-300">{selectedIdea.lookingFor}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Contact Information</h3>
                  <div className="space-y-1 text-zinc-300">
                    <p><strong>Name:</strong> {selectedIdea.name}</p>
                    <p><strong>GitHub:</strong> {selectedIdea.github}</p>
                    {selectedIdea.linkedin && <p><strong>LinkedIn:</strong> {selectedIdea.linkedin}</p>}
                    {selectedIdea.mobile && <p><strong>Mobile:</strong> {selectedIdea.mobile}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Lead Project</h3>
                  <p className="text-zinc-300">{selectedIdea.leadProject ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                {selectedIdea.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedIdea.id!, 'approved');
                        setSelectedIdea(null);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedIdea.id!, 'rejected');
                        setSelectedIdea(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

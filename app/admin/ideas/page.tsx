"use client";

import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import Link from "next/link";
import { getIdeas, updateIdeaStatus, deleteIdea, Idea, getIdeaContributionRequests, updateIdeaContributionRequestStatus, deleteIdeaContributionRequest, IdeaContributionRequest } from "@/lib/firebase";
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
  const [contributionRequests, setContributionRequests] = useState<IdeaContributionRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<IdeaContributionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<IdeaContributionRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ideas' | 'requests'>('ideas');

  useEffect(() => {
    fetchIdeas();
    fetchRequests();
  }, []);

  useEffect(() => {
    filterIdeas();
  }, [ideas, statusFilter]);

  useEffect(() => {
    filterRequests();
  }, [contributionRequests, requestStatusFilter]);

  const fetchIdeas = async () => {
    try {
      const fetchedIdeas = await getIdeas();
      setIdeas(fetchedIdeas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const fetchedRequests = await getIdeaContributionRequests();
      setContributionRequests(fetchedRequests);
    } catch (error) {
      console.error('Error fetching contribution requests:', error);
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

  const filterRequests = () => {
    if (requestStatusFilter === 'all') {
      setFilteredRequests(contributionRequests);
    } else {
      setFilteredRequests(contributionRequests.filter(request => request.status === requestStatusFilter));
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

  const handleRequestStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    setActionLoading(requestId);
    try {
      await updateIdeaContributionRequestStatus(requestId, status);
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    setActionLoading(requestId);
    try {
      await deleteIdeaContributionRequest(requestId);
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error deleting request:', error);
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Ideas & Requests</h1>
              <p className="text-zinc-400">Review ideas and contribution requests</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => activeTab === 'ideas' ? fetchIdeas() : fetchRequests()}
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

          {/* Tabs */}
          <div className="flex border-b border-zinc-800 mb-6">
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'ideas'
                  ? 'text-white border-white'
                  : 'text-zinc-400 border-transparent hover:text-zinc-300'
              }`}
            >
              Ideas ({ideas.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'requests'
                  ? 'text-white border-white'
                  : 'text-zinc-400 border-transparent hover:text-zinc-300'
              }`}
            >
              Contribution Requests ({contributionRequests.length})
            </button>
          </div>

          {/* Stats */}
          {activeTab === 'ideas' ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white">{contributionRequests.length}</h3>
                <p className="text-zinc-400 text-sm">Total Requests</p>
              </div>
              <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-yellow-400">{contributionRequests.filter(r => r.status === 'pending').length}</h3>
                <p className="text-zinc-400 text-sm">Pending Review</p>
              </div>
              <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-emerald-400">{contributionRequests.filter(r => r.status === 'approved').length}</h3>
                <p className="text-zinc-400 text-sm">Approved</p>
              </div>
              <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-red-400">{contributionRequests.filter(r => r.status === 'rejected').length}</h3>
                <p className="text-zinc-400 text-sm">Rejected</p>
              </div>
            </div>
          )}

          {/* Filter */}
          {activeTab === 'ideas' ? (
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
          ) : (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  {requestStatusFilter === 'all' ? 'All Requests' : requestStatusFilter.charAt(0).toUpperCase() + requestStatusFilter.slice(1)}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                  <DropdownMenuItem onClick={() => setRequestStatusFilter('all')} className="hover:bg-zinc-700">
                    All Requests
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRequestStatusFilter('pending')} className="hover:bg-zinc-700">
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRequestStatusFilter('approved')} className="hover:bg-zinc-700">
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRequestStatusFilter('rejected')} className="hover:bg-zinc-700">
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading {activeTab === 'ideas' ? 'ideas' : 'requests'}...</p>
          </div>
        ) : activeTab === 'ideas' ? (
          // Ideas Tab Content
          filteredIdeas.length === 0 ? (
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
          )
        ) : (
          // Requests Tab Content
          filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">No contribution requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="bg-neutral-900/40 border border-white/5 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-2">
                        <strong>Wants to join:</strong> {request.ideaTitle}
                      </p>
                      <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                        <strong>Tech Stack:</strong> {request.techStack}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Github className="w-3 h-3" />
                          {request.github}
                        </div>
                        {request.linkedin && (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 bg-zinc-800 rounded text-xs">LinkedIn</span>
                          </div>
                        )}
                        {request.portfolio && (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 bg-zinc-800 rounded text-xs">Portfolio</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                      {request.message && (
                        <p className="text-zinc-400 text-sm mt-2 italic">
                          "{request.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                    
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleRequestStatusUpdate(request.id!, 'approved')}
                          disabled={actionLoading === request.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" />
                          {actionLoading === request.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleRequestStatusUpdate(request.id!, 'rejected')}
                          disabled={actionLoading === request.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                          {actionLoading === request.id ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handleRequestDelete(request.id!)}
                      disabled={actionLoading === request.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Idea Detail Modal */}
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

        {/* Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Contribution Request</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Applicant Information</h3>
                  <div className="space-y-2 text-zinc-300">
                    <p><strong>Name:</strong> {selectedRequest.name}</p>
                    <p><strong>GitHub:</strong> {selectedRequest.github}</p>
                    {selectedRequest.linkedin && <p><strong>LinkedIn:</strong> {selectedRequest.linkedin}</p>}
                    {selectedRequest.portfolio && <p><strong>Portfolio:</strong> {selectedRequest.portfolio}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Idea Details</h3>
                  <p className="text-zinc-300"><strong>Project:</strong> {selectedRequest.ideaTitle}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Tech Stack</h3>
                  <p className="text-zinc-300">{selectedRequest.techStack}</p>
                </div>

                {selectedRequest.message && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-2">Message</h3>
                    <p className="text-zinc-300 italic">"{selectedRequest.message}"</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Submitted</h3>
                  <p className="text-zinc-300">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleRequestStatusUpdate(selectedRequest.id!, 'approved');
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        handleRequestStatusUpdate(selectedRequest.id!, 'rejected');
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedRequest(null)}
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

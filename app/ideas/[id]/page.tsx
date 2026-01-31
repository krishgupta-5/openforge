"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ThumbsUp, 
  Share2, 
  Calendar, 
  User, 
  Sparkles,
  Layers,
  Code,
  Flag,
  CornerDownRight,
  X,
  Check
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getIdeaById, Idea, addVote, removeVote, getVoteCount, hasUserVoted } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import LoginPopup from "@/components/LoginPopup";

// --- Components ---

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default function IdeaDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [votingLoading, setVotingLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleRequestToJoin = () => {
    if (user) {
      window.location.href = `/ideas/${params.id}/request-join`;
    } else {
      setShowLoginPopup(true);
    }
  };

  useEffect(() => {
    const fetchIdeaAndVotes = async () => {
      try {
        if (params.id) {
          const ideaData = await getIdeaById(params.id as string);
          setIdea(ideaData || null);
          
          if (ideaData && user) {
            // Fetch vote count
            const count = await getVoteCount(params.id as string);
            setVoteCount(count);
            
            // Check if current user has voted
            const voted = await hasUserVoted(params.id as string, user.id);
            setHasVoted(voted);
          }
        }
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaAndVotes();
  }, [params.id, user]);

  const handleVote = async () => {
    if (!user || !params.id) {
      // You could show a sign-in prompt here
      return;
    }

    setVotingLoading(true);
    try {
      if (hasVoted) {
        // Remove vote
        await removeVote(params.id as string, user.id);
        setVoteCount(prev => prev - 1);
        setHasVoted(false);
      } else {
        // Add vote
        await addVote(params.id as string, user.id);
        setVoteCount(prev => prev + 1);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      // You could show an error message here
    } finally {
      setVotingLoading(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setCopiedToClipboard(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
          <p className="text-zinc-400 mb-6">This idea may not exist or hasn't been approved yet.</p>
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2 rounded-full hover:bg-neutral-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-24">
        
        {/* --- Navigation --- */}
        <div className="mb-10">
          <Link 
            href="/ideas" 
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Ideas
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* --- Main Content (Left Column) --- */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Section */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  <Sparkles className="w-3 h-3" /> New Project
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Open
                </Badge>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                  {idea.difficulty}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold tracking-tight leading-tight">
                {idea.title}
              </h1>

              {/* Author Meta */}
              <div className="flex items-center gap-3 py-4 border-y border-zinc-900">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-zinc-700">
                  {idea.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{idea.name}</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-2">
                    @{idea.github} • <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(idea.createdAt)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-10">
              
              {/* Problem Statement */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Flag className="w-4 h-4" /> The Problem
                </h3>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {idea.problem}
                </p>
              </div>

              {/* Proposed Solution */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Proposed Solution
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {idea.solution}
                </p>
              </div>

              {/* Contribution Context */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <User className="w-4 h-4" /> Contribution Context
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {idea.helpContext}
                </p>
              </div>

              {/* Tech Stack & Roles (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
                
                {/* Category */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" /> Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-[#09090b] border border-zinc-800 rounded-md text-sm text-zinc-400">
                      {idea.category}
                    </span>
                  </div>
                </div>

                {/* Looking For */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Looking For
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <CornerDownRight className="w-3.5 h-3.5 text-zinc-600" />
                      {idea.lookingFor}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* --- Sidebar (Right Column) --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Vote Card */}
            <div className="p-6 rounded-xl bg-[#09090b] border border-zinc-800 space-y-6 sticky top-24">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">{voteCount}</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Votes</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleVote}
                  disabled={!user || votingLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold transition-all active:scale-[0.98] ${
                    !user 
                      ? "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed"
                      : hasVoted 
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-white text-black hover:bg-zinc-200"
                  } ${votingLoading ? "opacity-50 cursor-wait" : ""}`}
                >
                  {votingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {hasVoted ? "Removing..." : "Voting..."}
                    </>
                  ) : (
                    <>
                      <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-white" : ""}`} />
                      {!user ? "Sign in to Vote" : hasVoted ? "Voted" : "Upvote Idea"}
                    </>
                  )}
                </button>
                {!user && (
                  <p className="text-xs text-zinc-500 text-center">
                    You need to be signed in to vote
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800/50">
                <h4 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">Collaboration</h4>
                <button 
                  onClick={handleRequestToJoin}
                  className="w-full py-3 rounded-lg border border-dashed border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center"
                >
                  👋 Request to Join Project
                </button>
              </div>
            </div>

            {/* Share Link */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-900 bg-zinc-900/20">
              <span className="text-sm text-zinc-500">Share this idea</span>
              <button 
                onClick={handleShare}
                className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* View All Ideas Link */}
            <Link 
              href="/ideas" 
              className="flex items-center justify-center gap-2 p-4 rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">View All Ideas</span>
            </Link>

          </div>

        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Share this idea</h2>
              <button
                onClick={closeShareModal}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Share link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    readOnly
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                  >
                    {copiedToClipboard ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {copiedToClipboard && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <Check className="w-4 h-4" />
                  Link copied to clipboard!
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 text-center">
                  Share this idea with your friends and colleagues to help it get more visibility!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        message="Please sign in to request to join this project and collaborate with the team."
      />
    </div>
  );
}

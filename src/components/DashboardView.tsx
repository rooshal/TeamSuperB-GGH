import React, { useState } from 'react';
import { AnalysisResult, NavTab, UserProgress } from '../types';
import { 
  FileText, 
  Target, 
  AlertCircle, 
  CalendarRange, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  FolderSync,
  Layers,
  Award,
  Zap
} from 'lucide-react';

interface DashboardViewProps {
  analysis: AnalysisResult | null;
  history: AnalysisResult[];
  userProgress: UserProgress;
  onNavigate: (tab: NavTab) => void;
  onStartNewAnalysis: () => void;
  onLoadDemo: () => void;
  onClearData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analysis,
  history,
  userProgress,
  onNavigate,
  onStartNewAnalysis,
  onLoadDemo,
  onClearData
}) => {
  // Calculate roadmap progress
  const totalMilestones = analysis?.roadmap.reduce((acc, week) => acc + week.milestones.length, 0) || 16;
  const completedCount = userProgress.completedMilestoneIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalMilestones) * 100));

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Overview & Analytics
            </span>
            <span className="text-xs text-slate-400">
              Updated {analysis ? new Date(analysis.timestamp).toLocaleDateString() : 'Just now'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            SkillSpark <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your ATS resume alignment, close critical skill gaps, and execute your 4-week learning sprints.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3">
          {analysis && (
            <button
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-800/40 transition-colors"
              title="Reset current stored data"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          )}

          <button
            onClick={onStartNewAnalysis}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 hover:shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-cyan-200" />
            <span>Start New Analysis</span>
          </button>
        </div>
      </div>

      {/* Conditional: Empty State or 4 Metric Cards */}
      {!analysis ? (
        /* Empty State */
        <div className="rounded-3xl p-8 sm:p-12 text-center bg-slate-900/40 backdrop-blur-xl border border-dashed border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-md mx-auto space-y-5 relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-900/60 to-slate-900 border border-indigo-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-indigo-950/50">
              <FileText className="w-10 h-10 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">No Analysis Recorded Yet</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You haven't analyzed a resume yet! Upload or paste your resume and target job description to reveal your match score, missing competencies, and personalized 4-week roadmap.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStartNewAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4 text-cyan-200" />
                <span>Run First Analysis</span>
              </button>

              <button
                onClick={onLoadDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-cyan-300 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/30 shadow-md transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Load Hackathon Demo Data</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Tip: The demo data loads a full CS student profile with Docker, Redis, and 4-week sprint milestones.
            </div>
          </div>
        </div>
      ) : (
        /* Populated State */
        <div className="space-y-10">
          
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Resume Analysis */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Resume Analysis
                </span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-white truncate" title={analysis.targetRole}>
                  {analysis.targetRole}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  ATS Score: <span className="font-semibold text-cyan-400">{analysis.atsCompatibilityScore}/100</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate max-w-[150px]">
                  {analysis.resumeFileName || 'Pasted Resume'}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  Verified
                </span>
              </div>
            </div>

            {/* Card 2: Skill Match Score */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Skill Match Score
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  {analysis.matchScore}%
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  {analysis.matchScore >= 75 ? 'Strong Fit' : 'Moderate Fit'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${analysis.matchScore}%` }} 
                />
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{analysis.matchedSkills.length} Matched</span>
                <span className="text-indigo-300 font-medium">{analysis.missingSkills.length} Gaps Found</span>
              </div>
            </div>

            {/* Card 3: Missing Skills */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-violet-500/40 transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Missing Skills
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-extrabold text-white">
                  {analysis.missingSkills.length}
                </div>
                <span className="text-xs font-semibold text-rose-400">Critical Gaps</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {analysis.missingSkills.slice(0, 2).map((skill) => (
                  <span key={skill.name} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium truncate max-w-[110px]">
                    {skill.name}
                  </span>
                ))}
                {analysis.missingSkills.length > 2 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    +{analysis.missingSkills.length - 2} more
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => onNavigate('skill-gap')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Review Gaps</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <span className="text-[10px] text-slate-500">Prioritized</span>
              </div>
            </div>

            {/* Card 4: Roadmap Progress */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Roadmap Progress
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CalendarRange className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-extrabold text-white">
                  {progressPercent}%
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  {completedCount}/{totalMilestones} Tasks
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Open Roadmap</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <span className="text-slate-500 text-[10px]">Week 1-4 Sprints</span>
              </div>
            </div>

          </div>

          {/* Recent Analysis Section */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Active Profile Breakdown
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Recent Analysis: {analysis.targetRole}</span>
                  {analysis.targetCompany && (
                    <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {analysis.targetCompany}
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <span>View 4-Week Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('skill-gap')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <span>Deep Dive Gaps</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI Summary Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  AI Recruiter Assessment
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>
            </div>

            {/* Matched vs Missing Skills Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Matched Skills */}
              <div className="rounded-2xl p-5 bg-slate-950/60 border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Verified Strengths ({analysis.matchedSkills.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                    Matches Job Description
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  These competencies are recognized on your resume and satisfy the recruiter's baseline criteria.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {analysis.matchedSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="rounded-2xl p-5 bg-slate-950/60 border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">
                      Missing Skill Gaps ({analysis.missingSkills.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10">
                    Prioritized for Action
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Target technologies that frequently lead to candidate filter-out. Covered in your 4-week roadmap.
                </p>
                <div className="space-y-2 pt-1">
                  {analysis.missingSkills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{skill.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            skill.priority === 'High' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {skill.priority} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {skill.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {skill.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Recommendations Strip */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Recommended Next Steps
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analysis.keyRecommendations.map((rec, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Analysis History (if multiple analyses exist) */}
          {history.length > 1 && (
            <div className="rounded-3xl p-6 bg-slate-900/40 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Analysis History ({history.length})
              </h3>
              <div className="space-y-2">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.targetRole}</div>
                        <div className="text-slate-500 text-[11px]">
                          {new Date(item.timestamp).toLocaleDateString()} • {item.matchedSkills.length} Matched • {item.missingSkills.length} Missing
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-cyan-400">
                        {item.matchScore}% Match
                      </span>
                      <button
                        onClick={() => onNavigate('skill-gap')}
                        className="text-slate-400 hover:text-white"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

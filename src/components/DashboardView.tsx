import React from 'react';
import { AnalysisResult, NavTab, UserProgress } from '../types';
import { 
  FileText, 
  Target, 
  AlertCircle, 
  HelpCircle,
  CalendarRange, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Trash2, 
  ChevronRight,
  Briefcase,
  Layers,
  Award,
  PlayCircle
} from 'lucide-react';

interface DashboardViewProps {
  analysis: AnalysisResult | null;
  history: AnalysisResult[];
  userProgress: UserProgress;
  onNavigate: (tab: NavTab) => void;
  onStartNewAnalysis: () => void;
  onClearData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analysis,
  history,
  userProgress,
  onNavigate,
  onStartNewAnalysis,
  onClearData
}) => {
  // Calculate roadmap metrics
  const allTasks = analysis?.fourWeekRoadmap?.flatMap(w => w.tasks) || [];
  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter(t => userProgress.completedTaskIds.includes(t.id)).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Candidate Overview
            </span>
            <span className="text-xs text-slate-400">
              {analysis ? `Last Analyzed: ${new Date(analysis.timestamp).toLocaleDateString()}` : 'No active session'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            SkillSpark <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time tracking of your resume alignment, skills inventory, and 4-week roadmap progression.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3">
          {analysis && (
            <>
              <button
                onClick={onClearData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-800/40 transition-colors"
                title="Reset stored analysis and progress"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>

              <button
                onClick={() => onNavigate('roadmap')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <span>Continue My Roadmap</span>
              </button>
            </>
          )}

          <button
            onClick={onStartNewAnalysis}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-cyan-200" />
            <span>Start New Analysis</span>
          </button>
        </div>
      </div>

      {/* When NO analysis exists: Clean Empty State */}
      {!analysis ? (
        <div className="rounded-3xl p-8 sm:p-14 text-center bg-slate-900/40 backdrop-blur-xl border border-dashed border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-indigo-950/50">
              <FileText className="w-10 h-10 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">No Resume Analysis Recorded</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You haven't run an analysis yet. Upload your resume and provide a target job description to compute your match score, uncover critical skill gaps, and generate your personalized 4-week roadmap.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onStartNewAnalysis}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4 text-cyan-200" />
                <span>Start New Analysis</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Real Analysis Active Dashboard */
        <div className="space-y-10">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Target Job Title */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Role
                </span>
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-bold text-white truncate" title={analysis.targetRole}>
                {analysis.targetRole}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Level: <span className="text-cyan-300 font-semibold">{analysis.experienceLevel}</span>
              </div>
            </div>

            {/* Card 2: Latest Match Score */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Match Score
                </span>
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Target className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                {analysis.matchScore}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full" 
                  style={{ width: `${analysis.matchScore}%` }} 
                />
              </div>
            </div>

            {/* Card 3: Matched Skills */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Matched Skills
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {analysis.matchedSkills.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Verified on resume
              </div>
            </div>

            {/* Card 4: Partially Demonstrated Skills */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Partial Evidence
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-400">
                {analysis.partiallyDemonstratedSkills.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Needs practical depth
              </div>
            </div>

            {/* Card 5: Missing in Resume & Roadmap Progress */}
            <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Roadmap Progress
                </span>
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <CalendarRange className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-white">{progressPercent}%</span>
                <span className="text-[11px] text-slate-400">({completedCount}/{totalTasks})</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

          </div>

          {/* Recent Analysis Summary Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Active Analysis Overview
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {analysis.targetRole}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <span>Continue My Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('skill-gap')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <span>View Full Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score Explanation */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Evaluation Summary
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis.scoreExplanation}
              </p>
            </div>

            {/* Quick Skills Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Matched Strengths ({analysis.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {analysis.matchedSkills.slice(0, 4).map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {sk.name}
                    </span>
                  ))}
                  {analysis.matchedSkills.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{analysis.matchedSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20">
                <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Partially Demonstrated ({analysis.partiallyDemonstratedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {analysis.partiallyDemonstratedSkills.slice(0, 4).map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {sk.name}
                    </span>
                  ))}
                  {analysis.partiallyDemonstratedSkills.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{analysis.partiallyDemonstratedSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20">
                <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Not Found in Resume ({analysis.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {analysis.missingSkills.slice(0, 4).map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {sk.name}
                    </span>
                  ))}
                  {analysis.missingSkills.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{analysis.missingSkills.length - 4} more
                    </span>
                  )}
                </div>
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
                    <div>
                      <div className="font-bold text-white">{item.targetRole}</div>
                      <div className="text-slate-500 text-[11px]">
                        {new Date(item.timestamp).toLocaleDateString()} • {item.matchedSkills.length} Matched • {item.missingSkills.length} Missing
                      </div>
                    </div>
                    <span className="font-extrabold text-cyan-400">
                      {item.matchScore}% Match
                    </span>
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

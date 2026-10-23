import React, { useState } from 'react';
import { AnalysisResult, NavTab, UserProgress, WeekPlan } from '../types';
import confetti from 'canvas-confetti';
import { 
  CalendarRange, 
  CheckCircle2, 
  Circle, 
  Layers, 
  BookOpen, 
  Code2, 
  Sparkles, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Target,
  ExternalLink,
  Zap,
  RotateCcw
} from 'lucide-react';

interface RoadmapViewProps {
  analysis: AnalysisResult | null;
  userProgress: UserProgress;
  onToggleMilestone: (milestoneId: string) => void;
  onNavigate: (tab: NavTab) => void;
  onLoadDemo: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  analysis,
  userProgress,
  onToggleMilestone,
  onNavigate,
  onLoadDemo
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');

  const roadmap = analysis?.roadmap || [];
  const totalTasks = roadmap.reduce((acc, w) => acc + w.milestones.length, 0);
  const completedTasks = userProgress.completedMilestoneIds.length;
  const progressPercent = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;

  const handleMilestoneClick = (id: string, isCompleted: boolean) => {
    onToggleMilestone(id);
    if (!isCompleted) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981']
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported
      }
    }
  };

  const filteredWeeks = selectedWeek === 'all' 
    ? roadmap 
    : roadmap.filter(w => w.week === selectedWeek);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Header & Overall Sprint Progress */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              Personalized Plan
            </span>
            <span className="text-xs text-slate-400">
              {analysis ? `Targeting: ${analysis.targetRole}` : 'Curriculum Blueprint'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            4-Week <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Career Roadmap</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            A step-by-step technical sprint designed to close your detected skill gaps with production-level portfolio projects.
          </p>
        </div>

        {/* Overall Completion Metric Card */}
        {analysis && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-w-[280px] flex items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Progress
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {progressPercent}% <span className="text-xs font-medium text-emerald-400 font-sans">Complete</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {completedTasks} of {totalTasks} milestones checked
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-300 font-extrabold text-xs">
                {progressPercent}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* If No Analysis Loaded, show empty / demo loader */}
      {!analysis ? (
        <div className="rounded-3xl p-8 sm:p-12 text-center bg-slate-900/40 backdrop-blur-xl border border-dashed border-violet-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <CalendarRange className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Generate Your 4-Week Roadmap</h2>
              <p className="text-sm text-slate-400">
                Run a quick skill gap analysis or load our sample profile to generate an adaptive 4-week learning curriculum.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('skill-gap')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30"
              >
                Analyze Skills First
              </button>
              <button
                onClick={onLoadDemo}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-sm text-cyan-300 bg-slate-900 border border-cyan-500/30"
              >
                Load Hackathon Demo Roadmap
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Week Selector Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedWeek('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedWeek === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All 4 Weeks
            </button>
            {[1, 2, 3, 4].map((w) => {
              const weekPlan = roadmap.find(rp => rp.week === w);
              return (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedWeek === w
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Week {w}
                </button>
              );
            })}
          </div>

          {/* Week Cards List */}
          <div className="space-y-8">
            {filteredWeeks.map((week) => {
              const weekDone = week.milestones.every(m => userProgress.completedMilestoneIds.includes(m.id));
              const weekCompletedCount = week.milestones.filter(m => userProgress.completedMilestoneIds.includes(m.id)).length;

              return (
                <div
                  key={week.week}
                  className={`rounded-3xl p-6 sm:p-8 bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 shadow-xl ${
                    weekDone 
                      ? 'border-emerald-500/30 bg-emerald-950/10' 
                      : 'border-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  {/* Week Card Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg ${
                        weekDone 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
                      }`}>
                        W{week.week}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-xl font-bold text-white">
                            {week.title}
                          </h2>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {week.focusArea}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                          {week.description}
                        </p>
                      </div>
                    </div>

                    {/* Week completion status badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">
                          {weekCompletedCount}/{week.milestones.length} Completed
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {weekDone ? 'Sprint Ready' : 'In Progress'}
                        </div>
                      </div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        weekDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Hands-on Portfolio Artifact Callout */}
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                          Weekly Portfolio Artifact
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          {week.handsOnProject}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 self-start sm:self-auto">
                      Resume Highlight
                    </span>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Weekly Action Checklist
                    </div>
                    {week.milestones.map((m) => {
                      const isCompleted = userProgress.completedMilestoneIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleMilestoneClick(m.id, isCompleted)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                            isCompleted
                              ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-300'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              className={`mt-0.5 shrink-0 transition-transform group-hover:scale-110 ${
                                isCompleted ? 'text-emerald-400' : 'text-slate-600 group-hover:text-cyan-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                            <div>
                              <span className={`text-sm font-medium ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {m.task}
                              </span>
                              {m.resourceTitle && (
                                <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 mt-1">
                                  <BookOpen className="w-3 h-3" />
                                  <span>Curated Guide: {m.resourceTitle}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-slate-900 text-slate-500'
                          }`}>
                            {isCompleted ? 'Completed' : 'To Do'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

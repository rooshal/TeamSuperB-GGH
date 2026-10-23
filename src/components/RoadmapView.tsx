import React, { useState } from 'react';
import { AnalysisResult, NavTab, UserProgress, FourWeekRoadmapItem, RoadmapTask } from '../types';
import confetti from 'canvas-confetti';
import { 
  CalendarRange, 
  CheckCircle2, 
  Circle, 
  Layers, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  ArrowLeft, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Award, 
  Target, 
  CheckCheck,
  AlertTriangle,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface RoadmapViewProps {
  analysis: AnalysisResult | null;
  userProgress: UserProgress;
  onToggleTask: (taskId: string) => void;
  onResetProgress: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  analysis,
  userProgress,
  onToggleTask,
  onResetProgress,
  onNavigate
}) => {
  // State for collapsible weekly sections (default all open)
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<number, boolean>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleWeekCollapse = (weekNum: number) => {
    setCollapsedWeeks(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const fourWeekRoadmap: FourWeekRoadmapItem[] = analysis?.fourWeekRoadmap || [];

  // Calculate overall metrics
  const allTasks = fourWeekRoadmap.flatMap(w => w.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => userProgress.completedTaskIds.includes(t.id)).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Handle task click with celebration
  const handleTaskClick = (taskId: string, isDone: boolean) => {
    onToggleTask(taskId);
    if (!isDone) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981']
        });
      } catch (e) {
        // Fallback
      }
    }
  };

  // If no real analysis has been run
  if (!analysis) {
    return (
      <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900/80 border border-dashed border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-950/50">
          <CalendarRange className="w-10 h-10 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            No Personalized Roadmap Generated Yet
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Personalized 4-week roadmaps are formulated specifically from your real resume evaluation and target role requirements. Run a quick skill gap analysis to generate your customized plan.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('skill-gap')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Target className="w-4 h-4 text-cyan-200" />
            <span>Go to Skill Gap Analysis</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Top Header & Navigation Back */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => onNavigate('skill-gap')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Skill Gap Analysis</span>
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Personalized <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">4-Week Roadmap</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Targeting: <span className="text-white font-bold">{analysis.targetRole}</span> • Experience Level: <span className="text-cyan-300 font-semibold">{analysis.experienceLevel}</span>
          </p>
        </div>

        {/* Global Progress & Reset Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          {/* Progress Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-w-[260px] flex items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Roadmap Progress
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {progressPercent}% <span className="text-xs font-medium text-emerald-400">Complete</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {completedTasks} of {totalTasks} tasks done
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-300 font-black text-xs">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-800/40 transition-colors"
            title="Reset your task checkboxes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Are you sure you want to reset all checked roadmap tasks? This cannot be undone.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onResetProgress();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Roadmap Completion</span>
          <span className="text-cyan-400 font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* 4-Week Accordion Sections */}
      <div className="space-y-6">
        {fourWeekRoadmap.map((weekItem) => {
          const isCollapsed = !!collapsedWeeks[weekItem.week];
          const weekTasks = weekItem.tasks || [];
          const weekTotal = weekTasks.length;
          const weekDone = weekTasks.filter(t => userProgress.completedTaskIds.includes(t.id)).length;
          const weekPercent = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
          const isWeekComplete = weekTotal > 0 && weekDone === weekTotal;

          return (
            <div
              key={weekItem.week}
              className={`rounded-3xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 shadow-xl overflow-hidden ${
                isWeekComplete
                  ? 'border-emerald-500/35 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Expandable Week Header */}
              <div
                onClick={() => toggleWeekCollapse(weekItem.week)}
                className="p-6 sm:p-7 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg ${
                    isWeekComplete 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
                  }`}>
                    W{weekItem.week}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-xl font-bold text-white">
                        {weekItem.title}
                      </h2>
                      {isWeekComplete && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-cyan-300 font-medium mt-1">
                      Goal: {weekItem.weeklyGoal}
                    </div>
                  </div>
                </div>

                {/* Week completion status badge and collapse toggle */}
                <div className="flex items-center gap-4 shrink-0 self-end lg:self-auto">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      {weekDone}/{weekTotal} Tasks ({weekPercent}%)
                    </div>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${weekPercent}%` }} 
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400">
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Week Body (Collapsible) */}
              {!isCollapsed && (
                <div className="px-6 pb-6 sm:px-7 sm:pb-7 space-y-6 border-t border-slate-800/60 pt-5">
                  
                  {/* Skills to Learn Pill Strip */}
                  {weekItem.skillsToLearn && weekItem.skillsToLearn.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Target Skills:
                      </span>
                      {weekItem.skillsToLearn.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tasks Checklist */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Weekly Action Tasks ({weekTasks.length})
                    </div>

                    {weekTasks.map((task) => {
                      const isTaskDone = userProgress.completedTaskIds.includes(task.id);
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                            isTaskDone
                              ? 'bg-emerald-950/15 border-emerald-500/30'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Checkbox & Task details */}
                          <div className="flex items-start gap-3.5 flex-1">
                            <button
                              type="button"
                              onClick={() => handleTaskClick(task.id, isTaskDone)}
                              className={`mt-0.5 shrink-0 transition-transform hover:scale-110 ${
                                isTaskDone ? 'text-emerald-400' : 'text-slate-600 hover:text-cyan-400'
                              }`}
                            >
                              {isTaskDone ? (
                                <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>

                            <div className="space-y-2 flex-1">
                              <span 
                                onClick={() => handleTaskClick(task.id, isTaskDone)}
                                className={`text-sm font-medium cursor-pointer ${
                                  isTaskDone ? 'line-through text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                {task.task}
                              </span>

                              {/* Deliverable info */}
                              {task.deliverable && (
                                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span>Deliverable: <span className="text-slate-300 font-medium">{task.deliverable}</span></span>
                                </div>
                              )}

                              {/* Learning Resources */}
                              {task.resources && task.resources.length > 0 && (
                                <div className="pt-1 flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] text-slate-500">Resources:</span>
                                  {task.resources.map((res, rIdx) => (
                                    <a
                                      key={rIdx}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors"
                                    >
                                      <span>{res.title}</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Estimated Time Badge */}
                          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                            {task.estimatedHours && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                <Clock className="w-3 h-3 text-indigo-400" />
                                <span>~{task.estimatedHours}h</span>
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isTaskDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'
                            }`}>
                              {isTaskDone ? 'Done' : 'Pending'}
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation Strip */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('skill-gap')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skill Gap Analysis</span>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
        >
          <span>View Updated Dashboard</span>
        </button>
      </div>

    </div>
  );
};

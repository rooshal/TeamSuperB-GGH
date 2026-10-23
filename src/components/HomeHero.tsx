import React from 'react';
import { NavTab } from '../types';
import { 
  Sparkles, 
  LayoutDashboard, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Target, 
  CheckCircle2, 
  Zap,
  Code2,
  Layers
} from 'lucide-react';

interface HomeHeroProps {
  onNavigate: (tab: NavTab) => void;
  onLoadDemo: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate, onLoadDemo }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glows & Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] md:w-[900px] md:h-[500px] bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-cyan-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">
                Team SuperB Hackathon Project
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                SkillSpark AI v1.0
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Turn Your Skill Gaps Into{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                Career Growth.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              SkillSpark AI compares your resume directly with your target job description, pinpoints the exact skills and keywords you're missing, and generates an actionable, personalized 4-week learning roadmap to help you land your dream tech role.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('skill-gap')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Analyze My Skills</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/40 shadow-md transition-all duration-200 hover:scale-[1.01]"
              >
                <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                <span>Explore Dashboard</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant ATS Match Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>4-Week Adaptive Sprints</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Privacy-First In-Browser Storage</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Tech Glass Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative gradient border */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-cyan-500/30 shadow-2xl shadow-indigo-950/80">
                <div className="rounded-[22px] bg-slate-950/90 backdrop-blur-xl p-5 sm:p-6 border border-slate-800/80">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-mono text-slate-400 ml-2">SkillSpark AI Engine</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Live Preview
                    </span>
                  </div>

                  {/* Target Match Badge */}
                  <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-400">Target Role</span>
                      <span className="text-xs font-bold text-cyan-400">Full Stack Engineer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-white">78% Match</div>
                        <div className="text-[11px] text-slate-400">High Interview Viability</div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center p-1 shadow-lg shadow-indigo-600/30">
                        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                          <span className="text-sm font-extrabold text-cyan-300">78%</span>
                        </div>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full w-[78%]" />
                    </div>
                  </div>

                  {/* Matched vs Missing Comparison */}
                  <div className="space-y-3 mb-5">
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Matched Strengths in Resume (8)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL'].map(skill => (
                          <span key={skill} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-rose-400 mb-1.5 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Critical Skill Gaps to Bridge (4)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Redis Caching', 'Docker Containers', 'CI/CD Pipelines', 'System Design'].map(skill => (
                          <span key={skill} className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Roadmap Snippet */}
                  <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 p-3 rounded-xl border border-indigo-500/25 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-300">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">4-Week Structured Plan</div>
                        <div className="text-[10px] text-slate-400">Week 1: Redis Caching & Query Latency</div>
                      </div>
                    </div>
                    <button
                      onClick={onLoadDemo}
                      className="px-2.5 py-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 rounded-lg transition-colors"
                      title="Load this sample dataset into dashboard"
                    >
                      Load Demo
                    </button>
                  </div>

                </div>
              </div>

              {/* Floating mini badge */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Google XYZ Method</div>
                  <div className="text-[10px] text-slate-400">Resume bullets auto-optimized</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

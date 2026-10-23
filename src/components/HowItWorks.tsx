import React from 'react';
import { NavTab } from '../types';
import { 
  FileUp, 
  SearchCode, 
  CalendarCheck2, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  FileCheck
} from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (tab: NavTab) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Upload Resume',
      subtitle: 'Paste or upload your background',
      description: 'Input your student resume, university projects, or GitHub portfolio. SkillSpark AI parses technical languages, frameworks, databases, and past internships.',
      icon: FileUp,
      accent: 'from-cyan-500 to-blue-600',
      tag: 'Step 1'
    },
    {
      number: '02',
      title: 'Discover Skill Gaps',
      subtitle: 'AI vs. Job Requirements',
      description: 'Our engine cross-checks your competencies against real job listings. You get a transparent match score and an exact inventory of missing critical technologies.',
      icon: SearchCode,
      accent: 'from-indigo-500 to-violet-600',
      tag: 'Step 2'
    },
    {
      number: '03',
      title: 'Build Your Roadmap',
      subtitle: 'Structured 4-week execution',
      description: 'Receive an actionable 4-week curriculum with weekly focus topics, hands-on portfolio projects, and interactive milestone checklists to guarantee career readiness.',
      icon: CalendarCheck2,
      accent: 'from-violet-500 to-fuchsia-600',
      tag: 'Step 3'
    }
  ];

  return (
    <section className="py-20 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">SkillSpark AI</span> Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            From raw resume to interview-ready in 4 weeks. No generic advice—only concrete, milestone-driven technical progression.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="relative group rounded-3xl p-7 bg-slate-900/50 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                {/* Step Number Background Watermark */}
                <span className="absolute top-4 right-6 text-5xl font-black text-slate-800/40 select-none group-hover:text-indigo-900/30 transition-colors">
                  {step.number}
                </span>

                <div>
                  {/* Icon Box */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.accent} p-0.5 shadow-lg mb-6 flex items-center justify-center`}>
                    <div className="w-full h-full bg-slate-950/70 rounded-[14px] flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
                    {step.tag}
                  </span>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-300 mb-3">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom line hint */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interactive and customizable</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action strip */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('skill-gap')}
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800/80 px-6 py-3 rounded-full border border-indigo-500/25 transition-all group"
          >
            <span>Ready to test your resume? Start Free Analysis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

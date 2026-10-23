import React from 'react';
import { NavTab } from '../types';
import { 
  FileText, 
  Target, 
  CalendarRange, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Zap,
  Sparkles
} from 'lucide-react';

interface FeaturesSectionProps {
  onNavigate: (tab: NavTab) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'resume-analysis',
      title: 'Deep Resume Analysis',
      subtitle: 'ATS-Proof Technical Parsing',
      description: 'Parses complex resumes, extracting technical skills, frameworks, cloud tools, and project bullets. Evaluates action verbs and metrics alignment.',
      icon: FileText,
      accent: 'border-cyan-500/30 hover:border-cyan-400/60',
      badge: 'Core Engine',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      actionTab: 'skill-gap' as NavTab,
      actionText: 'Try Resume Parsing',
      points: [
        'Recognizes 400+ modern tech stacks',
        'Detects passive vs. high-impact action verbs',
        'Calculates real-world ATS compatibility'
      ]
    },
    {
      id: 'skill-matching',
      title: 'Intelligent Skill Matching',
      subtitle: 'Precision Gap Detection',
      description: 'Calculates the real mathematical and semantic overlap between candidate background and job requirements, highlighting High, Medium, and Low priority gaps.',
      icon: Target,
      accent: 'border-indigo-500/30 hover:border-indigo-400/60',
      badge: 'High Precision',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      actionTab: 'skill-gap' as NavTab,
      actionText: 'View Skill Matcher',
      points: [
        'Color-coded Matched vs. Missing breakdown',
        'Prioritizes deal-breaker tech requirements',
        'Industry benchmark comparison'
      ]
    },
    {
      id: 'personalized-roadmaps',
      title: 'Personalized 4-Week Roadmaps',
      subtitle: 'Adaptive Project-Based Sprints',
      description: 'Transforms identified weaknesses into an aggressive 4-week structured curriculum. Features weekly milestone checklists, portfolio projects, and curated docs.',
      icon: CalendarRange,
      accent: 'border-violet-500/30 hover:border-violet-400/60',
      badge: 'Actionable Plan',
      badgeColor: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
      actionTab: 'roadmap' as NavTab,
      actionText: 'Explore 4-Week Plan',
      points: [
        'Bite-sized weekly learning milestones',
        'Hands-on portfolio artifacts to build',
        'Interactive progress tracking with browser persistence'
      ]
    },
    {
      id: 'portfolio-projects',
      title: 'Targeted Portfolio Projects',
      subtitle: 'Proof-of-Competency Artifacts',
      description: 'Generates real-world capstone ideas tailored to your target job, providing concrete implementation steps and code deliverables to showcase to engineering leads.',
      icon: Award,
      accent: 'border-emerald-500/30 hover:border-emerald-400/60',
      badge: 'Recruiter Verified',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      actionTab: 'roadmap' as NavTab,
      actionText: 'View Project Deliverables',
      points: [
        'End-to-end architecture recommendations',
        'Demonstrates missing technologies in production',
        'Official documentation & trusted resources'
      ]
    }
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Student Success & Hackathon Excellence
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Every feature in SkillSpark AI is built to give aspiring engineers, data scientists, and designers a clear, measurable advantage.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`group relative rounded-3xl p-8 bg-slate-900/60 backdrop-blur-xl border ${feature.accent} transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-all shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-400 mb-3">
                    {feature.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 mb-8 border-t border-slate-800/80 pt-4">
                    {feature.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <div>
                  <button
                    onClick={() => onNavigate(feature.actionTab)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:underline transition-colors"
                  >
                    <span>{feature.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

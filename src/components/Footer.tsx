import React from 'react';
import { NavTab } from '../types';
import { Sparkles } from 'lucide-react';
interface FooterProps {
  onNavigate: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand & Team SuperB info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white">
                SkillSpark <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Team SuperB
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              AI-powered career readiness platform engineered for students and graduates to bridge skill gaps, optimize resumes, and master technical interviews.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-500">Built for:</span>
              <span className="font-semibold text-slate-300">Girl Geek Hackathon (GGH)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Platform
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Candidate Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('skill-gap')} className="hover:text-cyan-400 transition-colors">
                  Skill Gap Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('roadmap')} className="hover:text-cyan-400 transition-colors">
                  4-Week Learning Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('test-ai')} className="hover:text-cyan-400 transition-colors">
                  Test AI Sandbox
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Architecture & Stack
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Google Gemini 3.8 Flash SDK</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>React 19 & TypeScript</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>Tailwind CSS v4 Modern Theme</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Express Server Fullstack Proxy</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} SkillSpark AI • Created with pride by <span className="text-slate-300 font-semibold">Team SuperB</span>.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side local persistence</span>
            <span>•</span>
            <span>All mock & live endpoints ready</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { NavTab, AnalysisResult, UserProgress } from './types';
import { 
  getRecentAnalysis, 
  getAnalysisHistory, 
  getUserProgress, 
  saveRecentAnalysis, 
  toggleMilestone, 
  SAMPLE_ANALYSIS, 
  clearStoredData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { DashboardView } from './components/DashboardView';
import { SkillGapAnalysisView } from './components/SkillGapAnalysisView';
import { RoadmapView } from './components/RoadmapView';
import { TestAIView } from './components/TestAIView';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedMilestoneIds: [],
    lastUpdated: new Date().toISOString()
  });

  // Load persisted state from localStorage on boot
  useEffect(() => {
    const loadedAnalysis = getRecentAnalysis();
    const loadedHistory = getAnalysisHistory();
    const loadedProgress = getUserProgress();

    if (loadedAnalysis) {
      setAnalysis(loadedAnalysis);
    }
    setHistory(loadedHistory);
    setUserProgress(loadedProgress);
  }, []);

  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadDemo = () => {
    saveRecentAnalysis(SAMPLE_ANALYSIS);
    setAnalysis(SAMPLE_ANALYSIS);
    setHistory(getAnalysisHistory());
    setUserProgress({
      completedMilestoneIds: ['w1-m1', 'w1-m2'],
      lastUpdated: new Date().toISOString()
    });
    handleNavigate('dashboard');
  };

  const handleAnalysisComplete = (newAnalysis: AnalysisResult) => {
    saveRecentAnalysis(newAnalysis);
    setAnalysis(newAnalysis);
    setHistory(getAnalysisHistory());
    // Auto-navigate to dashboard so the user sees the newly generated cards
    handleNavigate('dashboard');
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updated = toggleMilestone(milestoneId);
    setUserProgress(updated);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear stored analysis data and progress?')) {
      clearStoredData();
      setAnalysis(null);
      setHistory([]);
      setUserProgress({
        completedMilestoneIds: [],
        lastUpdated: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar with brand and navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        hasAnalysis={!!analysis}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HomeHero 
              onNavigate={handleNavigate} 
              onLoadDemo={handleLoadDemo} 
            />
            <HowItWorks 
              onNavigate={handleNavigate} 
            />
            <FeaturesSection 
              onNavigate={handleNavigate} 
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            analysis={analysis}
            history={history}
            userProgress={userProgress}
            onNavigate={handleNavigate}
            onStartNewAnalysis={() => handleNavigate('skill-gap')}
            onLoadDemo={handleLoadDemo}
            onClearData={handleClearData}
          />
        )}

        {activeTab === 'skill-gap' && (
          <SkillGapAnalysisView
            currentAnalysis={analysis}
            onAnalysisComplete={handleAnalysisComplete}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            analysis={analysis}
            userProgress={userProgress}
            onToggleMilestone={handleToggleMilestone}
            onNavigate={handleNavigate}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {activeTab === 'test-ai' && (
          <TestAIView />
        )}
      </main>

      {/* Modern Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;

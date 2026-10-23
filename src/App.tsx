import React, { useState, useEffect } from 'react';
import { NavTab, AnalysisResult, UserProgress } from './types';
import { 
  getRecentAnalysis, 
  getAnalysisHistory, 
  getUserProgress, 
  saveRecentAnalysis, 
  toggleTask,
  resetProgress,
  clearStoredData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { DashboardView } from './components/DashboardView';
import { SkillGapAnalysisView } from './components/SkillGapAnalysisView';
import { RoadmapView } from './components/RoadmapView';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedTaskIds: [],
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

  const handleAnalysisComplete = (newAnalysis: AnalysisResult) => {
    saveRecentAnalysis(newAnalysis);
    setAnalysis(newAnalysis);
    setHistory(getAnalysisHistory());
    // Keep user on the analysis page so they can review their detailed results
    // and click "Generate My 4-Week Roadmap" or "View My Roadmap"
    handleNavigate('skill-gap');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = toggleTask(taskId);
    setUserProgress(updated);
  };

  const handleResetProgress = () => {
    const resetState = resetProgress();
    setUserProgress(resetState);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear your stored analysis and progress?')) {
      clearStoredData();
      setAnalysis(null);
      setHistory([]);
      setUserProgress({
        completedTaskIds: [],
        lastUpdated: new Date().toISOString()
      });
      handleNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Modern Navbar */}
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
              onLoadDemo={() => handleNavigate('skill-gap')} 
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
            onToggleTask={handleToggleTask}
            onResetProgress={handleResetProgress}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;

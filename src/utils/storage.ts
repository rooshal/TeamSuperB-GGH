import { AnalysisResult, UserProgress } from '../types';

const STORAGE_KEY_ANALYSIS = 'skillspark_recent_analysis';
const STORAGE_KEY_HISTORY = 'skillspark_analysis_history';
const STORAGE_KEY_PROGRESS = 'skillspark_user_progress';

export function getRecentAnalysis(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANALYSIS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load recent analysis from storage', e);
    return null;
  }
}

export function saveRecentAnalysis(analysis: AnalysisResult): void {
  try {
    localStorage.setItem(STORAGE_KEY_ANALYSIS, JSON.stringify(analysis));
    
    // Save to history (keep latest 5)
    const history = getAnalysisHistory();
    const filtered = history.filter(item => item.id !== analysis.id);
    filtered.unshift(analysis);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered.slice(0, 5)));
  } catch (e) {
    console.error('Failed to save analysis to storage', e);
  }
}

export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function getUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) {
      return {
        completedTaskIds: [],
        lastUpdated: new Date().toISOString()
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      completedTaskIds: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function toggleTask(taskId: string): UserProgress {
  const current = getUserProgress();
  const exists = current.completedTaskIds.includes(taskId);
  const updatedIds = exists
    ? current.completedTaskIds.filter(id => id !== taskId)
    : [...current.completedTaskIds, taskId];

  const updated: UserProgress = {
    ...current,
    completedTaskIds: updatedIds,
    lastUpdated: new Date().toISOString()
  };

  saveUserProgress(updated);
  return updated;
}

export function resetProgress(): UserProgress {
  const resetState: UserProgress = {
    completedTaskIds: [],
    lastUpdated: new Date().toISOString()
  };
  saveUserProgress(resetState);
  return resetState;
}

export function clearStoredData(): void {
  localStorage.removeItem(STORAGE_KEY_ANALYSIS);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
}

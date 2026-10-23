export interface MissingSkill {
  name: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface RoadmapMilestone {
  id: string;
  task: string;
  completed: boolean;
  resourceTitle?: string;
  resourceUrl?: string;
  estimatedHours?: number;
}

export interface WeekPlan {
  week: number;
  title: string;
  focusArea: string;
  description: string;
  handsOnProject: string;
  milestones: RoadmapMilestone[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  targetRole: string;
  targetCompany?: string;
  resumeFileName?: string;
  resumeSnippet: string;
  jobDescriptionSnippet: string;
  matchScore: number; // 0 to 100
  atsCompatibilityScore: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  summary: string;
  keyRecommendations: string[];
  roadmap: WeekPlan[];
}

export interface UserProgress {
  completedMilestoneIds: string[];
  lastUpdated: string;
  notes?: Record<string, string>;
}

export type NavTab = 'home' | 'dashboard' | 'skill-gap' | 'roadmap' | 'test-ai';

export type NavTab = 'home' | 'dashboard' | 'skill-gap' | 'roadmap';

export interface SkillItem {
  name: string;
  explanation: string;
  evidence?: string;
}

export interface PartiallyDemonstratedSkill {
  name: string;
  explanation: string;
  evidence?: string;
  missingAspect?: string;
}

export interface MissingSkillItem {
  name: string;
  explanation: string;
  requirement?: string;
}

export interface PrioritizedGap {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  rationale: string;
  impactOnRole: string;
}

export interface LearningResource {
  title: string;
  url: string;
  verified: boolean;
}

export interface RoadmapTask {
  id: string;
  task: string;
  estimatedHours: number;
  deliverable: string;
  resources: LearningResource[];
}

export interface FourWeekRoadmapItem {
  week: number;
  title: string;
  weeklyGoal: string;
  skillsToLearn: string[];
  tasks: RoadmapTask[];
}

export interface RecommendedProject {
  title: string;
  description: string;
  skillsDemonstrated: string[];
  difficulty: string;
  implementationSteps: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  targetRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Experienced';
  resumeFileName?: string;
  resumeSnippet: string;
  jobDescriptionSnippet: string;
  matchScore: number; // 0 to 100
  scoreExplanation: string;
  matchedSkills: SkillItem[];
  partiallyDemonstratedSkills: PartiallyDemonstratedSkill[];
  missingSkills: MissingSkillItem[]; // Skills Not Found in Resume
  prioritizedGaps: PrioritizedGap[];
  fourWeekRoadmap: FourWeekRoadmapItem[];
  recommendedProjects: RecommendedProject[];
  limitations: string;
  isRealAiResponse?: boolean;
}

export interface UserProgress {
  completedTaskIds: string[];
  lastUpdated: string;
}

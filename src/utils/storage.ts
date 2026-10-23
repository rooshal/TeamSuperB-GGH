import { AnalysisResult, UserProgress, WeekPlan } from '../types';

const STORAGE_KEY_ANALYSIS = 'skillspark_recent_analysis';
const STORAGE_KEY_HISTORY = 'skillspark_analysis_history';
const STORAGE_KEY_PROGRESS = 'skillspark_user_progress';

// High-fidelity sample analysis crafted for hackathon presentations
export const SAMPLE_ANALYSIS: AnalysisResult = {
  id: 'sample-analysis-demo-01',
  timestamp: new Date().toISOString(),
  targetRole: 'Full Stack Software Engineer',
  targetCompany: 'Google / High-Growth Fintech',
  resumeFileName: 'Alex_Chen_CS_Resume.pdf',
  resumeSnippet: 'CS Senior with projects in React, TypeScript, Express, Python, and SQLite. Built campus club platform and automated event scheduling app.',
  jobDescriptionSnippet: 'Seeking Full Stack Engineers with expertise in React, TypeScript, Node.js, distributed caching (Redis), Docker containerization, PostgreSQL, and scalable microservices architecture.',
  matchScore: 78,
  atsCompatibilityScore: 84,
  matchedSkills: [
    'React.js',
    'TypeScript',
    'JavaScript (ES6+)',
    'Node.js & Express',
    'Git Version Control',
    'RESTful APIs',
    'HTML5 / CSS3 / Tailwind',
    'Relational Schema Design (SQL)'
  ],
  missingSkills: [
    {
      name: 'Distributed Caching (Redis)',
      category: 'Backend & Performance',
      priority: 'High',
      description: 'Crucial for caching hot database queries and rate-limiting high-throughput endpoints.'
    },
    {
      name: 'Containerization (Docker & Compose)',
      category: 'DevOps & Infrastructure',
      priority: 'High',
      description: 'Standard across production engineering teams for consistent local runtime and deployment.'
    },
    {
      name: 'System Design & Load Balancing',
      category: 'Architecture',
      priority: 'Medium',
      description: 'Foundational for junior engineering technical interviews and horizontal scaling discussions.'
    },
    {
      name: 'CI/CD Pipelines (GitHub Actions)',
      category: 'DevOps & Quality',
      priority: 'Medium',
      description: 'Automated test suites, linting, and automated Docker image pushes on PR review.'
    }
  ],
  summary: 'Your core frontend and backend programming foundations are solid (78% match). Closing key infrastructure gaps like Docker and Redis will make your portfolio immediately stand out to tier-1 tech recruiters.',
  keyRecommendations: [
    'Add an in-memory caching layer (Redis) to your campus club project and benchmark response time.',
    'Create a multi-container Dockerfile and docker-compose.yml for your existing full-stack repositories.',
    'Quantify resume metrics using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".'
  ],
  roadmap: [
    {
      week: 1,
      title: 'Week 1: Core Performance & Caching Layer',
      focusArea: 'Redis, Query Profiling & Indexing',
      description: 'Master in-memory caching patterns to elevate your backend from basic CRUD to enterprise scale.',
      handsOnProject: 'Build a high-throughput API rate-limiter & cached search endpoint with Redis and Express.',
      milestones: [
        { id: 'w1-m1', task: 'Review Redis core data structures (Strings, Hashes, Sorted Sets)', completed: true, resourceTitle: 'Redis University Fast Track' },
        { id: 'w1-m2', task: 'Implement Cache-Aside pattern for database read queries', completed: true, resourceTitle: 'Patterns of Enterprise Architecture' },
        { id: 'w1-m3', task: 'Benchmark API latency before and after Redis caching using Apache Bench or autocannon', completed: false, resourceTitle: 'HTTP Benchmarking Guide' },
        { id: 'w1-m4', task: 'Write unit tests for cache invalidation strategies', completed: false, resourceTitle: 'Jest & Supertest Integration' }
      ]
    },
    {
      week: 2,
      title: 'Week 2: Docker & Containerized Environments',
      focusArea: 'Dockerfiles, Compose & Multi-stage builds',
      description: 'Turn locally running projects into isolated, reproducible containers ready for production.',
      handsOnProject: 'Multi-container Full Stack App (React + Node + Redis + Postgres) running seamlessly with one docker-compose up.',
      milestones: [
        { id: 'w2-m1', task: 'Write optimized multi-stage Dockerfiles for Vite and Node.js backend', completed: false, resourceTitle: 'Docker Production Best Practices' },
        { id: 'w2-m2', task: 'Configure Docker Compose network and healthchecks', completed: false, resourceTitle: 'Docker Compose V2 Spec' },
        { id: 'w2-m3', task: 'Mount persistent volumes for Postgres and Redis data integrity', completed: false, resourceTitle: 'Data Persistence in Containers' },
        { id: 'w2-m4', task: 'Test container cold boot and resource limits', completed: false, resourceTitle: 'Container Resource Constraints' }
      ]
    },
    {
      week: 3,
      title: 'Week 3: CI/CD Automation & Security Best Practices',
      focusArea: 'GitHub Actions, Linting & Automated Testing',
      description: 'Automate build, test, and security scanning on every git commit.',
      handsOnProject: 'Complete GitHub Actions CI/CD pipeline with matrix tests and Docker image publishing.',
      milestones: [
        { id: 'w3-m1', task: 'Create GitHub Action workflow for linting, type-checking, and unit tests', completed: false, resourceTitle: 'GitHub Actions for Node.js' },
        { id: 'w3-m2', task: 'Configure pull request gating to require 100% passing tests before merge', completed: false, resourceTitle: 'Branch Protection Rules' },
        { id: 'w3-m3', task: 'Add security vulnerability scanning (npm audit & trivy container scan)', completed: false, resourceTitle: 'DevSecOps Fundamentals' },
        { id: 'w3-m4', task: 'Generate test coverage badges for your GitHub repository README', completed: false, resourceTitle: 'Codecov / Jest Coverage' }
      ]
    },
    {
      week: 4,
      title: 'Week 4: Capstone Portfolio Polish & System Design Mastery',
      focusArea: 'System Architecture Diagrams, STAR Stories & Live Demo',
      description: 'Tie everything together into a portfolio-grade repository and prepare for behavioral and technical rounds.',
      handsOnProject: 'Production-ready showcase with interactive live demo URL, architecture diagram, and benchmark results in README.',
      milestones: [
        { id: 'w4-m1', task: 'Design clean architecture diagram using Excalidraw or Mermaid.js in README', completed: false, resourceTitle: 'Tech Architecture Docs' },
        { id: 'w4-m2', task: 'Draft 4 STAR behavioral stories covering conflict, leadership, and technical roadblocks', completed: false, resourceTitle: 'STAR Interview Matrix' },
        { id: 'w4-m3', task: 'Deploy live project to Cloud Run or Render with custom domain', completed: false, resourceTitle: 'Cloud Deployment Guide' },
        { id: 'w4-m4', task: 'Run mock interview simulation in SkillSpark AI Test suite', completed: false, resourceTitle: 'SkillSpark AI Mock Practice' }
      ]
    }
  ]
};

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
    
    // Also append to history
    const history = getAnalysisHistory();
    const filtered = history.filter(item => item.id !== analysis.id);
    filtered.unshift(analysis);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered.slice(0, 10)));
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
        completedMilestoneIds: ['w1-m1', 'w1-m2'],
        lastUpdated: new Date().toISOString()
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      completedMilestoneIds: [],
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

export function toggleMilestone(milestoneId: string): UserProgress {
  const current = getUserProgress();
  const exists = current.completedMilestoneIds.includes(milestoneId);
  const updatedIds = exists
    ? current.completedMilestoneIds.filter(id => id !== milestoneId)
    : [...current.completedMilestoneIds, milestoneId];

  const updated: UserProgress = {
    ...current,
    completedMilestoneIds: updatedIds,
    lastUpdated: new Date().toISOString()
  };

  saveUserProgress(updated);
  return updated;
}

export function clearStoredData(): void {
  localStorage.removeItem(STORAGE_KEY_ANALYSIS);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
}

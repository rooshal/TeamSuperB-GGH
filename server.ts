import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
// Allow up to 15MB for PDF base64 payloads
app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK with server-side User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. PDF Resume Parsing Endpoint
app.post('/api/resume/parse-pdf', async (req: Request, res: Response) => {
  try {
    const { base64Data, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({
        success: false,
        error: 'No file data received. Please select a valid PDF file.',
      });
    }

    // Strip data URL header if present (e.g. data:application/pdf;base64,...)
    const pureBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '').trim();
    const buffer = Buffer.from(pureBase64, 'base64');

    // 5 MB binary size limit check
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds the 5 MB limit (${(buffer.length / (1024 * 1024)).toFixed(1)} MB). Please upload a smaller PDF or paste your resume text directly.`,
      });
    }

    // Parse PDF
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const parsedResult = await parser.getText();
    const rawText = parsedResult.text ? parsedResult.text.trim() : '';

    if (!rawText || rawText.length < 30) {
      return res.status(422).json({
        success: false,
        error: 'Could not extract readable text from this PDF. It may be a scanned image or encrypted. Please copy and paste your resume text into the text area instead.',
      });
    }

    return res.json({
      success: true,
      text: rawText,
      fileName: fileName || 'Uploaded_Resume.pdf',
    });
  } catch (err: any) {
    console.error('Error parsing PDF:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process PDF file. It might be corrupted or password-protected. Please paste your resume text directly into the input field below.',
    });
  }
});

// 2. Real Gemini Skill Gap Analysis & 4-Week Roadmap Engine
app.post('/api/skill-gap/analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, jobTitle, jobDescription, experienceLevel } = req.body;

    // Validation
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is too brief or missing. Please provide at least 20 characters of resume or project details.',
      });
    }

    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Target job title is required (e.g. Full Stack Developer, Data Scientist).',
      });
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Target job description is required. Please paste the job requirements and responsibilities.',
      });
    }

    const expLevel = ['Beginner', 'Intermediate', 'Experienced'].includes(experienceLevel)
      ? experienceLevel
      : 'Beginner';

    if (!ai || !apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured in server environment. Please attach an API key in AI Studio Secrets.',
      });
    }

    const systemInstruction = `You are a Principal Tech Recruiter, Hiring Committee Lead, and Senior Engineering Mentor.
Your mission is to perform an objective, rigorous, yet constructive Skill Gap Analysis between a candidate's resume and a target job description, tailored specifically for their stated experience level (${expLevel}).
You must also construct a high-impact, personalized 4-week learning roadmap to bridge their identified gaps.

Rules for skill classification:
- "matchedSkills": Clear, verifiable evidence of this skill exists in the resume.
- "partiallyDemonstratedSkills": Some evidence exists (e.g. mentioned briefly, used in a basic school project), but depth, production maturity, or practical application is unclear.
- "missingSkills" (Not Found in Resume): The skill is required or preferred in the job description but not clearly demonstrated anywhere in the resume.
CRITICAL INTEGRITY PRINCIPLE: State clearly in your explanation and in "limitations" that "Skills Not Found in Resume" indicates skills absent from the provided document, NOT that the user lacks the skill in their actual abilities.

Rules for 4-Week Roadmap:
The roadmap must directly target the candidate's highest-priority missing skills for ${jobTitle} at the ${expLevel} level.
- Week 1: "Week 1 — Learn the Fundamentals" (Understand missing skills & study essential concepts)
- Week 2: "Week 2 — Practice and Apply" (Complete exercises & small practical tasks)
- Week 3: "Week 3 — Build a Project" (Create a practical portfolio project related to the target job)
- Week 4: "Week 4 — Finish and Demonstrate" (Complete project, improve code, document, and prepare portfolio evidence)
Each week MUST contain 3 to 5 actionable tasks with estimated hours and trustworthy learning resources (prefer official documentation like MDN, React Docs, Python Docs, Docker Docs, PostgreSQL Docs).

Always output strictly valid JSON matching the exact schema requested.`;

    const prompt = `Candidate Background:
- Experience Level: ${expLevel}
- Target Job Title: ${jobTitle}
- Target Job Description:
"""
${jobDescription.slice(0, 4000)}
"""

- Candidate Resume Content:
"""
${resumeText.slice(0, 6000)}
"""

Perform the skill-gap analysis and generate the personalized 4-week roadmap.
Return STRICTLY a JSON object with this exact structure:
{
  "targetRole": "${jobTitle}",
  "matchScore": <number from 0 to 100 representing realistic candidate qualification match>,
  "scoreExplanation": "<Detailed 2-3 sentence explanation of how the score was calculated based on required vs demonstrated qualifications>",
  "matchedSkills": [
    {
      "name": "<Skill Name>",
      "explanation": "<Why this is considered a match>",
      "evidence": "<Direct reference or quote from resume>"
    }
  ],
  "partiallyDemonstratedSkills": [
    {
      "name": "<Skill Name>",
      "explanation": "<What is partially demonstrated>",
      "evidence": "<Mention from resume>",
      "missingAspect": "<What is missing to reach full production competency>"
    }
  ],
  "missingSkills": [
    {
      "name": "<Skill Name>",
      "explanation": "<Why this skill is absent from the resume>",
      "requirement": "<Requirement from the job description>"
    }
  ],
  "prioritizedGaps": [
    {
      "name": "<Skill Name>",
      "priority": "High" | "Medium" | "Low",
      "rationale": "<Why bridging this gap is urgent for getting hired>",
      "impactOnRole": "<How this skill affects daily engineering performance>"
    }
  ],
  "fourWeekRoadmap": [
    {
      "week": 1,
      "title": "Week 1 — Learn the Fundamentals",
      "weeklyGoal": "<Clear goal for week 1>",
      "skillsToLearn": ["<Skill 1>", "<Skill 2>"],
      "tasks": [
        {
          "id": "w1-t1",
          "task": "<Actionable task description>",
          "estimatedHours": <number>,
          "deliverable": "<Specific artifact or verification check>",
          "resources": [
            {
              "title": "<Official Resource Title>",
              "url": "<Official docs URL or standard resource>",
              "verified": true
            }
          ]
        }
      ]
    },
    {
      "week": 2,
      "title": "Week 2 — Practice and Apply",
      "weeklyGoal": "<Clear goal for week 2>",
      "skillsToLearn": ["<Skill 1>", "<Skill 2>"],
      "tasks": [
        {
          "id": "w2-t1",
          "task": "<Actionable task description>",
          "estimatedHours": <number>,
          "deliverable": "<Specific artifact or verification check>",
          "resources": [
            {
              "title": "<Official Resource Title>",
              "url": "<Official docs URL or standard resource>",
              "verified": true
            }
          ]
        }
      ]
    },
    {
      "week": 3,
      "title": "Week 3 — Build a Project",
      "weeklyGoal": "<Clear goal for week 3>",
      "skillsToLearn": ["<Skill 1>", "<Skill 2>"],
      "tasks": [
        {
          "id": "w3-t1",
          "task": "<Actionable task description>",
          "estimatedHours": <number>,
          "deliverable": "<Specific artifact or verification check>",
          "resources": [
            {
              "title": "<Official Resource Title>",
              "url": "<Official docs URL or standard resource>",
              "verified": true
            }
          ]
        }
      ]
    },
    {
      "week": 4,
      "title": "Week 4 — Finish and Demonstrate",
      "weeklyGoal": "<Clear goal for week 4>",
      "skillsToLearn": ["<Skill 1>", "<Skill 2>"],
      "tasks": [
        {
          "id": "w4-t1",
          "task": "<Actionable task description>",
          "estimatedHours": <number>,
          "deliverable": "<Specific artifact or verification check>",
          "resources": [
            {
              "title": "<Official Resource Title>",
              "url": "<Official docs URL or standard resource>",
              "verified": true
            }
          ]
        }
      ]
    }
  ],
  "recommendedProjects": [
    {
      "title": "<Compelling Portfolio Project Title>",
      "description": "<Detailed overview of what to build and why it proves competency to recruiters>",
      "skillsDemonstrated": ["<Skill 1>", "<Skill 2>"],
      "difficulty": "Intermediate" | "Advanced",
      "implementationSteps": [
        "<Step 1>",
        "<Step 2>",
        "<Step 3>"
      ]
    }
  ],
  "limitations": "Skills labeled 'Not Found in Resume' denote competencies not explicitly evidenced in your uploaded resume text. This analysis evaluates your written application materials and does not imply you lack these abilities in practice."
}`;

    // Call Gemini with safety timeout of 60 seconds and low thinking latency
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // lower temperature for precise classification
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API request timed out after 60 seconds. Please try again.')), 60000);
    });

    const response = await Promise.race([callPromise, timeoutPromise]);
    const rawText = response.text || '';

    if (!rawText) {
      throw new Error('Empty response received from Gemini model.');
    }

    // Clean JSON markdown fences if any
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', cleaned);
      throw new Error('Gemini returned an invalid JSON response format. Please retry.');
    }

    // Validate essential schema fields
    if (typeof parsed.matchScore !== 'number') {
      parsed.matchScore = 70;
    }
    parsed.matchScore = Math.max(0, Math.min(100, Math.round(parsed.matchScore)));

    if (!Array.isArray(parsed.matchedSkills)) parsed.matchedSkills = [];
    if (!Array.isArray(parsed.partiallyDemonstratedSkills)) parsed.partiallyDemonstratedSkills = [];
    if (!Array.isArray(parsed.missingSkills)) parsed.missingSkills = [];
    if (!Array.isArray(parsed.prioritizedGaps)) parsed.prioritizedGaps = [];
    if (!Array.isArray(parsed.fourWeekRoadmap)) parsed.fourWeekRoadmap = [];
    if (!Array.isArray(parsed.recommendedProjects)) parsed.recommendedProjects = [];

    parsed.targetRole = jobTitle;
    parsed.experienceLevel = expLevel;
    parsed.isRealAiResponse = true;

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error('Error in /api/skill-gap/analyze:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An error occurred during AI analysis. Please check your inputs and try again.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SkillSpark AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import React, { useState, useRef } from 'react';
import { AnalysisResult, NavTab, SkillItem, PartiallyDemonstratedSkill, MissingSkillItem, PrioritizedGap, RecommendedProject } from '../types';
import { 
  Target, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ArrowRight, 
  Zap, 
  Briefcase, 
  Layers, 
  RefreshCw,
  FolderCode,
  ShieldAlert,
  Info,
  Award,
  ChevronRight,
  FileCheck2,
  X
} from 'lucide-react';

interface SkillGapAnalysisViewProps {
  currentAnalysis: AnalysisResult | null;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onNavigate: (tab: NavTab) => void;
}

export const SkillGapAnalysisView: React.FC<SkillGapAnalysisViewProps> = ({
  currentAnalysis,
  onAnalysisComplete,
  onNavigate
}) => {
  // Form input states (preserve inputs)
  const [jobTitle, setJobTitle] = useState(currentAnalysis?.targetRole || '');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Experienced'>(
    currentAnalysis?.experienceLevel || 'Beginner'
  );
  const [jobDescription, setJobDescription] = useState(currentAnalysis?.jobDescriptionSnippet || '');
  const [resumeText, setResumeText] = useState(currentAnalysis?.resumeSnippet || '');
  const [uploadedFileName, setUploadedFileName] = useState(currentAnalysis?.resumeFileName || '');

  // UI status states
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle PDF file upload with 5MB validation and extraction
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUploadError(null);
    setPdfSuccessMessage(null);

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setPdfUploadError('Please select a valid PDF file. Other file formats are not supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (5MB max)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setPdfUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please upload a PDF under 5 MB or paste your text below.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploadingPdf(true);
    setUploadedFileName(file.name);

    try {
      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file from local disk.'));
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      // Send to server-side PDF parser
      const response = await fetch('/api/resume/parse-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          fileName: file.name,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to extract text from PDF.');
      }

      setResumeText(resData.text);
      setPdfSuccessMessage(`Extracted ${resData.text.length} characters from ${file.name}`);
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      setPdfUploadError(
        err.message || 'Could not extract text from this PDF. Please copy and paste your resume text manually below.'
      );
    } finally {
      setIsUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Run Real Gemini AI Analysis
  const handleAnalyzeSkills = async () => {
    setAnalysisError(null);

    // Form validation
    if (!jobTitle.trim()) {
      setAnalysisError('Please enter a target job title.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setAnalysisError('Please provide a complete job description (at least 20 characters).');
      return;
    }

    if (!resumeText.trim() || resumeText.trim().length < 20) {
      setAnalysisError('Please provide your resume content by uploading a PDF or pasting your resume text (at least 20 characters).');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/skill-gap/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim(),
          experienceLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gemini API analysis failed. Please verify your inputs and try again.');
      }

      const result: AnalysisResult = {
        ...data.data,
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
        resumeFileName: uploadedFileName || 'Manual Text Input',
        resumeSnippet: resumeText,
        jobDescriptionSnippet: jobDescription,
      };

      onAnalysisComplete(result);
    } catch (err: any) {
      console.error('Skill gap analysis error:', err);
      setAnalysisError(err.message || 'Analysis could not be completed. Please check your network and retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Competency Gap Engine
          </span>
          <span className="text-xs text-slate-400">Powered by Gemini 3.8 Flash</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Skill Gap <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Analysis</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Upload your resume and paste your target job requirements. Our AI performs an objective evaluation, identifying matched strengths, partially demonstrated areas, and high-priority gaps.
        </p>
      </div>

      {/* Input Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Target Job Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Target Position & Requirements</h2>
                <span className="text-[11px] text-slate-400">Specify what you are applying for</span>
              </div>
            </div>

            {/* Job Title & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Target Job Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Full Stack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Experience Level <span className="text-rose-400">*</span>
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="Beginner">Beginner (Student / 0-1 yr)</option>
                  <option value="Intermediate">Intermediate (1-3 yrs)</option>
                  <option value="Experienced">Experienced (3+ yrs)</option>
                </select>
              </div>
            </div>

            {/* Target Job Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Target Job Description <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {jobDescription.length} characters
                </span>
              </div>
              <textarea
                rows={9}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting, required qualifications, technical stack, and responsibilities here..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Resume Upload & Manual Paste */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Candidate Resume</h2>
                <span className="text-[11px] text-slate-400">Upload PDF or paste your background</span>
              </div>
            </div>

            {/* PDF Upload Box */}
            <div className="p-4 rounded-2xl border border-dashed border-indigo-500/30 bg-slate-950/70 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600/20 text-cyan-400 shrink-0">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Upload PDF Resume
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Standard text-based PDF (Max 5 MB)
                    </div>
                  </div>
                </div>

                <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all">
                  {isUploadingPdf ? 'Parsing...' : 'Select PDF'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    disabled={isUploadingPdf}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Extraction Feedback Messages */}
              {pdfUploadError && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pdfUploadError}</span>
                </div>
              )}

              {pdfSuccessMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pdfSuccessMessage}</span>
                </div>
              )}
            </div>

            {/* Alternative Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Or Paste Resume Content Manually <span className="text-rose-400">*</span>
                </label>
                {resumeText && (
                  <button
                    type="button"
                    onClick={() => { setResumeText(''); setUploadedFileName(''); setPdfSuccessMessage(null); }}
                    className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear text</span>
                  </button>
                )}
              </div>
              <textarea
                rows={9}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your education, technical skills, projects, and work experience here if not uploading a PDF..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-400 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Analysis Error Message & Retry Control */}
      {analysisError && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Analysis Error</div>
              <p className="text-xs text-rose-300 mt-0.5">{analysisError}</p>
            </div>
          </div>
          <button
            onClick={handleAnalyzeSkills}
            className="px-3.5 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800/60 text-white text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 hidden sm:flex">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Ready for Real-Time AI Evaluation
            </div>
            <div className="text-xs text-slate-400">
              Gemini will classify skills, highlight evidence, prioritize gaps, and formulate your 4-week roadmap.
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyzeSkills}
          disabled={isAnalyzing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Skills with Gemini 3.8 Flash...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200" />
              <span>Analyze My Skills</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Real Gemini Analysis Results Display */}
      {currentAnalysis && (
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 backdrop-blur-xl border border-indigo-500/30 shadow-2xl space-y-8 animate-in slide-in-from-bottom-6">
          
          {/* Top Result Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Analysis Complete
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(currentAnalysis.timestamp).toLocaleString()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Match Results for {currentAnalysis.targetRole}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                Experience Level: <span className="text-cyan-300 font-semibold">{currentAnalysis.experienceLevel}</span>
              </div>
            </div>

            {/* Navigation CTA Buttons */}
            <div className="flex items-center flex-wrap gap-3">
              <button
                onClick={() => onNavigate('roadmap')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Generate My 4-Week Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('roadmap')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <span>View My Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Match Score & Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            {/* Visual Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * currentAnalysis.matchScore) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">
                    {currentAnalysis.matchScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Match Score
                  </span>
                </div>
              </div>
              <span className={`mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                currentAnalysis.matchScore >= 75
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : currentAnalysis.matchScore >= 50
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              }`}>
                {currentAnalysis.matchScore >= 75 ? 'Strong Candidate Fit' : currentAnalysis.matchScore >= 50 ? 'Moderate Fit with Key Gaps' : 'Significant Upleveling Needed'}
              </span>
            </div>

            {/* Score Explanation */}
            <div className="md:col-span-8 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>How This Score Was Determined</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentAnalysis.scoreExplanation}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
                <div>Matched: <span className="text-emerald-400 font-bold">{currentAnalysis.matchedSkills.length}</span></div>
                <div>Partially Demonstrated: <span className="text-amber-400 font-bold">{currentAnalysis.partiallyDemonstratedSkills.length}</span></div>
                <div>Not Found in Resume: <span className="text-rose-400 font-bold">{currentAnalysis.missingSkills.length}</span></div>
              </div>
            </div>
          </div>

          {/* 3-Column Skills Classification Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Skill Classification Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Matched Skills */}
              <div className="rounded-2xl p-5 bg-slate-950/70 border border-emerald-500/25 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Matched Skills</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                    {currentAnalysis.matchedSkills.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Clear, verifiable evidence found in your resume.
                </p>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {currentAnalysis.matchedSkills.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4 text-center">
                      No directly matched skills identified.
                    </div>
                  ) : (
                    currentAnalysis.matchedSkills.map((skill, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-1">
                        <div className="text-xs font-bold text-emerald-300">{skill.name}</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{skill.explanation}</p>
                        {skill.evidence && (
                          <div className="text-[10px] text-slate-400 italic bg-slate-950/80 p-1.5 rounded border border-slate-800/80 mt-1">
                            Evidence: "{skill.evidence}"
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 2. Partially Demonstrated Skills */}
              <div className="rounded-2xl p-5 bg-slate-950/70 border border-amber-500/25 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Partially Demonstrated</h4>
                  </div>
                  <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">
                    {currentAnalysis.partiallyDemonstratedSkills.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mentioned or implied, but practical depth is unclear.
                </p>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {currentAnalysis.partiallyDemonstratedSkills.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4 text-center">
                      No partially demonstrated skills found.
                    </div>
                  ) : (
                    currentAnalysis.partiallyDemonstratedSkills.map((skill, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                        <div className="text-xs font-bold text-amber-300">{skill.name}</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{skill.explanation}</p>
                        {skill.missingAspect && (
                          <div className="text-[10px] text-amber-400/90 font-medium pt-0.5">
                            To bridge: {skill.missingAspect}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3. Skills Not Found in Resume */}
              <div className="rounded-2xl p-5 bg-slate-950/70 border border-rose-500/25 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <h4 className="text-sm font-bold text-white">Not Found in Resume</h4>
                  </div>
                  <span className="text-xs font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10">
                    {currentAnalysis.missingSkills.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Required in job description but absent from resume text.
                </p>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {currentAnalysis.missingSkills.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4 text-center">
                      No missing requirements found!
                    </div>
                  ) : (
                    currentAnalysis.missingSkills.map((skill, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 space-y-1">
                        <div className="text-xs font-bold text-rose-300">{skill.name}</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{skill.explanation}</p>
                        {skill.requirement && (
                          <div className="text-[10px] text-slate-400 italic bg-slate-950/80 p-1.5 rounded border border-slate-800/80 mt-1">
                            Requirement: {skill.requirement}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Prioritized Skill Gaps & Urgency */}
          {currentAnalysis.prioritizedGaps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <span>Prioritized Skill Gaps & Hiring Impact</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentAnalysis.prioritizedGaps.map((gap, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">{gap.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          gap.priority === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : gap.priority === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {gap.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {gap.rationale}
                      </p>
                    </div>
                    <div className="text-[11px] text-cyan-300/90 pt-2 border-t border-slate-900 font-medium">
                      Impact: {gap.impactOnRole}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Projects */}
          {currentAnalysis.recommendedProjects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderCode className="w-4 h-4 text-cyan-400" />
                <span>Suggested Portfolio Projects to Prove Competency</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentAnalysis.recommendedProjects.map((proj, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                          Difficulty: {proj.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.skillsDemonstrated.map((sk) => (
                        <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                    {proj.implementationSteps && proj.implementationSteps.length > 0 && (
                      <div className="pt-2 border-t border-slate-900 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Implementation Steps:
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                          {proj.implementationSteps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrity & Limitations Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 text-xs text-slate-400 flex items-start gap-3 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300">Methodology & Limitations Notice: </span>
              {currentAnalysis.limitations}
            </div>
          </div>

          {/* Bottom Action Strip to Roadmap */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Your personalized 4-week roadmap is ready to explore based on these results.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Generate My 4-Week Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <span>View My Roadmap</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

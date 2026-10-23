import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  Send, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Terminal, 
  RefreshCw,
  Copy,
  Layers,
  FileSearch
} from 'lucide-react';

export const TestAIView: React.FC = () => {
  const [activeTestTab, setActiveTestTab] = useState<'interview' | 'resume' | 'counselor'>('interview');
  const [roleInput, setRoleInput] = useState('Full Stack Software Engineer');
  const [bulletInput, setBulletInput] = useState('Worked on backend APIs for student scheduling and fixed performance bugs.');
  const [chatInput, setChatInput] = useState('What are the top 3 highest-ROI skills a CS sophomore should learn this summer?');
  
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // 1. Test Mock Interview Question Generation
  const handleTestInterview = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setTestResult(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/interview/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleInput,
          level: 'Student / New Grad',
          type: 'Technical & Architecture',
          questionNumber: 1
        })
      });

      const data = await res.json();
      setLatencyMs(Math.round(performance.now() - start));
      if (data.success) {
        setTestResult({
          endpoint: 'POST /api/interview/generate-question',
          status: res.status,
          model: 'gemini-3.8-flash',
          data: data.data
        });
      } else {
        setErrorMsg(data.error || 'Request failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Test Resume Bullet Optimizer (Google XYZ)
  const handleTestResume = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setTestResult(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/resume/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalBullet: bulletInput,
          targetRole: roleInput,
          industryKeywords: 'scalability, latency, microservices, testing'
        })
      });

      const data = await res.json();
      setLatencyMs(Math.round(performance.now() - start));
      if (data.success) {
        setTestResult({
          endpoint: 'POST /api/resume/optimize-bullet',
          status: res.status,
          model: 'gemini-3.8-flash',
          data: data.data
        });
      } else {
        setErrorMsg(data.error || 'Request failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Test Counselor Chat
  const handleTestCounselor = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setTestResult(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/counselor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: chatInput }],
          userContext: {
            targetRole: roleInput,
            major: 'Computer Science',
            gradYear: '2026'
          }
        })
      });

      const data = await res.json();
      setLatencyMs(Math.round(performance.now() - start));
      if (data.success) {
        setTestResult({
          endpoint: 'POST /api/counselor/chat',
          status: res.status,
          model: 'gemini-3.8-flash',
          data: { responseText: data.text }
        });
      } else {
        setErrorMsg(data.error || 'Request failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Developer & Judge Sandbox
            </span>
            <span className="text-xs text-slate-400">Server-Side Gemini 3.8 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Test <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI Engine</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Verify real-time backend API endpoints, inspect latency metrics, and test resume and interview generation pipelines.
          </p>
        </div>

        {/* Diagnostic badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-300">gemini-3.8-flash</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel & Output Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Test Suite Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl space-y-6">
            
            {/* Tab Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => { setActiveTestTab('interview'); setTestResult(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTestTab === 'interview'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mock Interview Q
              </button>
              <button
                onClick={() => { setActiveTestTab('resume'); setTestResult(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTestTab === 'resume'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                XYZ Optimizer
              </button>
              <button
                onClick={() => { setActiveTestTab('counselor'); setTestResult(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTestTab === 'counselor'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Career Advisor
              </button>
            </div>

            {/* Inputs based on selected tab */}
            {activeTestTab === 'interview' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Target Role for Mock Question
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <button
                  onClick={handleTestInterview}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Generate Question with Gemini</span>
                </button>
              </div>
            )}

            {activeTestTab === 'resume' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Sample Resume Bullet Point
                  </label>
                  <textarea
                    rows={4}
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={handleTestResume}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Test Google XYZ Bullet Transformation</span>
                </button>
              </div>
            )}

            {activeTestTab === 'counselor' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Student Career Question
                  </label>
                  <textarea
                    rows={4}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={handleTestCounselor}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Test Advisor Response</span>
                </button>
              </div>
            )}

            {/* Quick Presets Strip */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Quick Test Prompts
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  'Explain Redis Cache-Aside vs Write-Through',
                  'System Design for TinyURL',
                  'Behavioral question on resolving sprint deadlock'
                ].map((txt) => (
                  <button
                    key={txt}
                    onClick={() => {
                      if (activeTestTab === 'interview') setRoleInput(txt);
                      else if (activeTestTab === 'counselor') setChatInput(txt);
                    }}
                    className="text-left text-xs text-slate-400 hover:text-cyan-300 p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 transition-colors truncate"
                  >
                    → {txt}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Output & Diagnostic Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl p-6 bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">
                  Response Stream & JSON Inspection
                </span>
              </div>

              {latencyMs !== null && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    200 OK
                  </span>
                  <span className="text-slate-400">
                    {latencyMs}ms
                  </span>
                </div>
              )}
            </div>

            {/* Output Display */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin" />
                <div className="text-xs text-slate-400 font-mono">
                  Streaming response from Gemini 3.8 Flash...
                </div>
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Execution Error:</div>
                  <div>{errorMsg}</div>
                </div>
              </div>
            ) : testResult ? (
              <div className="space-y-4">
                {/* Visual Preview */}
                {testResult.data?.question && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Generated Interview Question
                    </span>
                    <div className="text-sm font-semibold text-white leading-relaxed">
                      "{testResult.data.question}"
                    </div>
                    {testResult.data.hints && (
                      <div className="text-xs text-slate-400 pt-1">
                        Hints: {testResult.data.hints.join(' • ')}
                      </div>
                    )}
                  </div>
                )}

                {testResult.data?.variants && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                      Google XYZ Optimized Variants
                    </span>
                    {testResult.data.variants.map((v: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-indigo-300">{v.type}</div>
                        <div className="text-xs text-white leading-relaxed">"{v.bullet}"</div>
                        <div className="text-[11px] text-slate-400 font-mono pt-1">{v.formulaBreakdown}</div>
                      </div>
                    ))}
                  </div>
                )}

                {testResult.data?.responseText && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Counselor AI Guidance
                    </span>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {testResult.data.responseText}
                    </div>
                  </div>
                )}

                {/* Raw JSON Debug View */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Raw JSON Output
                  </span>
                  <pre className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto max-h-60 leading-relaxed">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 space-y-2">
                <Cpu className="w-8 h-8 mx-auto text-slate-700" />
                <div className="text-xs font-mono">
                  Select a test above and click run to inspect live output.
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

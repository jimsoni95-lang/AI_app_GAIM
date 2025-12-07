import React, { useState } from 'react';
import { APP_NAME, LOGO_URL, SALES_FRAMEWORKS, DEAL_STAGES } from './constants';
import { SalesFramework, DealStage, AnalysisResult } from './types';
import PromptViewer from './components/PromptViewer';
import AudioInput from './components/AudioInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeAudio } from './services/geminiService';
import { Lock, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';

type AppState = 'locked' | 'idle' | 'analyzing' | 'results';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [appState, setAppState] = useState<AppState>('locked');
  const [framework, setFramework] = useState<SalesFramework>('MEDDIC');
  const [dealStage, setDealStage] = useState<DealStage>('Discovery');
  const [error, setError] = useState<string | null>(null);
  
  // Analysis Data
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  const handleUnlock = () => {
    if (tempKey.trim().length > 10) {
      setApiKey(tempKey);
      setAppState('idle');
      setError(null);
    } else {
      setError("Please enter a valid Gemini API Key.");
    }
  };

  const handleAudioReady = async (base64: string, mimeType: string) => {
    setAppState('analyzing');
    setError(null);

    try {
      const result = await analyzeAudio(apiKey, base64, mimeType, framework, dealStage);
      setAnalysisData(result);
      setAppState('results');
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please check your API key and try again.");
      setAppState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-serif selection:bg-[#D4AF37] selection:text-black">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsPromptOpen(true)}
               className="group relative"
             >
                <img src={LOGO_URL} alt="GAIM Logo" className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></div>
             </button>
             <div className="flex flex-col">
                <h1 className="text-xl font-cinzel tracking-wider text-[#F5F5F5]">{APP_NAME}</h1>
                <span className="text-[10px] text-[#888] uppercase tracking-[0.2em] font-sans">Revenue Intelligence</span>
             </div>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-cinzel text-[#888]">
            <span className="cursor-pointer hover:text-[#D4AF37] transition-colors">Calls</span>
            <span className="cursor-pointer hover:text-[#D4AF37] transition-colors">Coaching</span>
            <span className="cursor-pointer hover:text-[#D4AF37] transition-colors">Insights</span>
            <span className="cursor-pointer text-[#F5F5F5] border-b border-[#D4AF37]">Analysis</span>
          </nav>

          {analysisData && (
             <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30">
                <span className="text-[10px] uppercase text-[#D4AF37] font-bold">Deal Momentum</span>
                <span className="font-cinzel text-[#F5F5F5]">{analysisData.performance_metrics.deal_momentum_score}</span>
             </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-900/50 rounded flex items-center gap-3 text-red-200">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* STATE: LOCKED */}
        {appState === 'locked' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
             <div className="w-16 h-16 rounded-full bg-[#111] border border-[#333] flex items-center justify-center mb-4">
               <Lock size={32} className="text-[#666]" />
             </div>
             <div>
               <h2 className="text-4xl font-cinzel text-[#F5F5F5] mb-4">Secure Intelligence Gateway</h2>
               <p className="text-[#888] max-w-md mx-auto font-serif text-lg leading-relaxed">
                 Enter your Gemini API key to unlock enterprise-grade sales analysis. 
                 Keys are processed locally and never stored.
               </p>
             </div>
             
             <div className="w-full max-w-md space-y-4">
               <div className="relative">
                 <input 
                   type="password" 
                   placeholder="Enter Gemini API Key"
                   value={tempKey}
                   onChange={(e) => setTempKey(e.target.value)}
                   className="w-full bg-[#0A0A0A] border border-[#333] text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono text-sm"
                 />
               </div>
               <button 
                 onClick={handleUnlock}
                 className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-cinzel font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
               >
                 Initialize System <ChevronRight size={18} />
               </button>
               <p className="text-xs text-[#555]">
                 Powered by Google Gemini 2.5 Flash & Pro
               </p>
             </div>
          </div>
        )}

        {/* STATE: IDLE (Configuration) */}
        {appState === 'idle' && (
           <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center mb-12">
                 <h2 className="text-3xl font-cinzel text-[#F5F5F5]">New Analysis Session</h2>
                 <p className="text-[#888] mt-2">Configure context and upload audio to begin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest text-[#666]">Sales Framework</label>
                   <select 
                     value={framework}
                     onChange={(e) => setFramework(e.target.value as SalesFramework)}
                     className="w-full bg-[#0A0A0A] border border-[#333] text-[#F5F5F5] p-3 rounded focus:border-[#D4AF37] outline-none appearance-none"
                   >
                     {SALES_FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest text-[#666]">Deal Stage</label>
                   <select 
                     value={dealStage}
                     onChange={(e) => setDealStage(e.target.value as DealStage)}
                     className="w-full bg-[#0A0A0A] border border-[#333] text-[#F5F5F5] p-3 rounded focus:border-[#D4AF37] outline-none appearance-none"
                   >
                     {DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
              </div>

              <AudioInput onAudioReady={handleAudioReady} disabled={false} />
           </div>
        )}

        {/* STATE: ANALYZING */}
        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-pulse">
             <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
               <div className="absolute inset-2 border-r-2 border-[#D4AF37]/50 rounded-full animate-spin-slow"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="text-[#D4AF37]" size={32} />
               </div>
             </div>
             <div className="text-center space-y-2">
               <h2 className="text-2xl font-cinzel text-[#F5F5F5]">Processing Intelligence</h2>
               <p className="text-[#888] font-serif">Transcribing audio, diarizing speakers, and applying {framework} methodology...</p>
             </div>
          </div>
        )}

        {/* STATE: RESULTS */}
        {appState === 'results' && analysisData && (
          <div>
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setAppState('idle')}
                className="text-xs uppercase tracking-widest text-[#666] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
              >
                 Start New Analysis <ChevronRight size={14} />
              </button>
            </div>
            <AnalysisDashboard data={analysisData} />
          </div>
        )}

      </main>

      <PromptViewer isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} />
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;

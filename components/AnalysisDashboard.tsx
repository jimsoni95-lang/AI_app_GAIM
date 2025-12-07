import React from 'react';
import { AnalysisResult } from '../types';
import { SentimentGraph } from './Charts';
import Transcript from './Transcript';
import { ShieldCheck, ShieldAlert, Zap, TrendingUp, Users, Clock } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const metrics = data.performance_metrics;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Executive Summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-[#0A0A0A] border border-[#D4AF37] rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          <span className="text-[#C4C4C4] text-xs uppercase tracking-widest font-cinzel mb-2 z-10">Overall Score</span>
          <span className="text-6xl font-cinzel text-[#F5F5F5] z-10">{metrics.overall_score}</span>
          <span className="text-[#D4AF37] text-sm mt-2 font-serif italic z-10">
            {metrics.overall_score > 75 ? "Excellent Execution" : metrics.overall_score > 50 ? "Average Performance" : "Needs Improvement"}
          </span>
        </div>

        {/* Deal Risk */}
        <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6 flex flex-col justify-center relative">
           <span className="text-[#666] text-xs uppercase tracking-widest font-cinzel mb-4">Deal Risk</span>
           <div className="flex items-center gap-3">
             {metrics.deal_risk_level === 'High' ? <ShieldAlert className="text-[#B91C1C]" size={32} /> : <ShieldCheck className="text-[#D4AF37]" size={32} />}
             <div className="flex flex-col">
               <span className={`text-2xl font-cinzel ${metrics.deal_risk_level === 'High' ? 'text-[#B91C1C]' : metrics.deal_risk_level === 'Medium' ? 'text-amber-500' : 'text-[#D4AF37]'}`}>
                 {metrics.deal_risk_level}
               </span>
               <span className="text-xs text-[#888]">Risk Assessment</span>
             </div>
           </div>
        </div>

        {/* Momentum & Coachability */}
        <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#666] text-xs uppercase tracking-widest font-cinzel">Momentum</span>
              <span className="text-[#D4AF37] font-bold">{metrics.deal_momentum_score}/100</span>
            </div>
            <div className="w-full bg-[#111] h-1 rounded-full overflow-hidden mb-6">
              <div className="bg-[#D4AF37] h-full" style={{ width: `${metrics.deal_momentum_score}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#666] text-xs uppercase tracking-widest font-cinzel">Coachability</span>
              <span className="text-[#F5F5F5] font-bold">{metrics.coachability_score}/100</span>
            </div>
             <div className="w-full bg-[#111] h-1 rounded-full overflow-hidden">
              <div className="bg-[#555] h-full" style={{ width: `${metrics.coachability_score}%` }}></div>
            </div>
        </div>

        {/* High Value Moments (Mini List) */}
        <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6 overflow-y-auto max-h-[160px]">
           <span className="text-[#666] text-xs uppercase tracking-widest font-cinzel sticky top-0 bg-[#0A0A0A] pb-2 block border-b border-[#222]">Key Moments</span>
           <ul className="mt-3 space-y-3">
             {data.high_value_moments.slice(0, 3).map((m, i) => (
               <li key={i} className="flex gap-2 text-xs">
                 <span className="text-[#D4AF37] font-mono shrink-0">{m.timestamp}</span>
                 <span className="text-[#CCC] line-clamp-2">{m.summary}</span>
               </li>
             ))}
           </ul>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Transcript & Chart */}
        <div className="lg:col-span-2 space-y-8">
           <SentimentGraph data={data.sentiment_graph_data} />
           
           {/* Detailed Performance Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0F0F0F] p-4 rounded border border-[#222]">
                <div className="flex items-center gap-2 mb-2 text-[#666]">
                  <Users size={14} /> <span className="text-xs uppercase">Talk Ratio</span>
                </div>
                <div className="text-lg font-cinzel text-[#F5F5F5]">
                  {metrics.talk_ratio_rep}% <span className="text-xs text-[#666]">Rep</span>
                </div>
              </div>
              <div className="bg-[#0F0F0F] p-4 rounded border border-[#222]">
                 <div className="flex items-center gap-2 mb-2 text-[#666]">
                  <Zap size={14} /> <span className="text-xs uppercase">Interruptions</span>
                </div>
                 <div className="text-lg font-cinzel text-[#F5F5F5]">
                  {metrics.interruption_count}
                </div>
              </div>
               <div className="bg-[#0F0F0F] p-4 rounded border border-[#222]">
                 <div className="flex items-center gap-2 mb-2 text-[#666]">
                  <TrendingUp size={14} /> <span className="text-xs uppercase">Avg Q Depth</span>
                </div>
                 <div className="text-lg font-cinzel text-[#F5F5F5]">
                  {metrics.avg_question_depth} <span className="text-xs text-[#666]">/ 5</span>
                </div>
              </div>
              <div className="bg-[#0F0F0F] p-4 rounded border border-[#222]">
                 <div className="flex items-center gap-2 mb-2 text-[#666]">
                  <Clock size={14} /> <span className="text-xs uppercase">Monologues</span>
                </div>
                 <div className="text-lg font-cinzel text-[#F5F5F5]">
                  {metrics.monologue_fatigue_segments} <span className="text-xs text-[#666]">&gt;90s</span>
                </div>
              </div>
           </div>

           <Transcript transcript={data.transcript} />
        </div>

        {/* Right Column: Coaching Matrix */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Top 3 Steps Card */}
          <div className="bg-gradient-to-b from-[#0F0F0F] to-[#050505] border border-[#D4AF37] rounded-lg p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h3 className="font-cinzel text-lg text-[#F5F5F5] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D4AF37]"></span>
              Coach's Orders
            </h3>
            <ul className="space-y-4">
              {data.coaching_card.action_steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold border border-[#D4AF37]/50">
                     {idx + 1}
                   </span>
                   <p className="text-sm text-[#CCC] font-serif leading-tight pt-1">{step}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Matrix */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-[#666] text-sm uppercase tracking-widest border-b border-[#222] pb-2">Framework Analysis</h3>
            {data.coaching_matrix.map((item, idx) => (
              <div key={idx} className="bg-[#0F0F0F] border-l-2 border-[#333] hover:border-[#D4AF37] transition-colors p-4 rounded-r group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-[#E0E0E0]">{item.skill_area}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.score >= 8 ? 'bg-green-900/30 text-green-400' : item.score >= 5 ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
                    {item.score}/10
                  </span>
                </div>
                <p className="text-xs text-[#888] italic mb-2 border-l border-[#444] pl-2">"{item.evidence_quote}"</p>
                <p className="text-xs text-[#D4AF37] group-hover:text-[#F4DF90]">
                  <strong className="text-[#666] uppercase text-[10px]">Tip:</strong> {item.advice}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] rounded p-4">
            <h4 className="text-[#666] text-xs uppercase mb-2">Missed Opportunities</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.coaching_card.missed_opportunities.map((opp, i) => (
                <li key={i} className="text-xs text-[#A0A0A0]">{opp}</li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AnalysisDashboard;

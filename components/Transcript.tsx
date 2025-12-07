import React from 'react';
import { TranscriptTurn } from '../types';

interface TranscriptProps {
  transcript: TranscriptTurn[];
}

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => {
  return (
    <div className="h-[500px] flex flex-col bg-[#0A0A0A] border border-[#222] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#0F0F0F]">
        <h3 className="font-cinzel text-[#F5F5F5]">Diarized Transcript</h3>
        <span className="text-xs text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20">
          AI Diarization Active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {transcript.map((turn, idx) => {
          const isRep = turn.speaker.toLowerCase().includes('rep');
          const isCustomer = turn.speaker.toLowerCase().includes('customer');
          
          return (
            <div key={idx} className={`flex flex-col gap-1 ${isRep ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs uppercase tracking-wider font-bold ${isRep ? 'text-[#D4AF37]' : 'text-[#C4C4C4]'}`}>
                  {turn.speaker}
                </span>
                <span className="text-[10px] text-[#444] font-mono">{turn.timestamp}</span>
              </div>
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                  isRep 
                    ? 'bg-[#1a1810] border border-[#D4AF37]/30 text-[#E0E0E0] rounded-tr-none' 
                    : 'bg-[#111] border border-[#333] text-[#A0A0A0] rounded-tl-none'
                }`}
              >
                {turn.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transcript;

import React from 'react';
import { MOCK_ANALYSIS_PROMPT_SPEC, COLORS } from '../constants';
import { X } from 'lucide-react';

interface PromptViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromptViewer: React.FC<PromptViewerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-lg bg-[#0F0F0F] border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <h2 className="text-xl font-cinzel text-[#D4AF37]">App Blueprint: GAIMvantage Prompt</h2>
          <button onClick={onClose} className="text-[#C4C4C4] hover:text-[#D4AF37] transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] bg-[#050505]">
          <pre className="text-sm font-mono text-[#C4C4C4] whitespace-pre-wrap">
            {MOCK_ANALYSIS_PROMPT_SPEC}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PromptViewer;

import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, FileAudio } from 'lucide-react';

interface AudioInputProps {
  onAudioReady: (base64: string, mimeType: string) => void;
  disabled: boolean;
}

const AudioInput: React.FC<AudioInputProps> = ({ onAudioReady, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        processFile(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setFileName("Microphone Recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      processFile(file);
    }
  };

  const processFile = (blob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract Base64 and MimeType
      // result format: "data:audio/mp3;base64,....."
      const matches = result.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        onAudioReady(matches[2], matches[1]);
      }
    };
    reader.readAsDataURL(blob);
  };

  return (
    <div className="flex flex-col gap-4 p-6 border border-[#222] rounded-lg bg-[#0A0A0A]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-cinzel text-[#F5F5F5]">Input Source</h3>
        {fileName && (
          <div className="flex items-center gap-2 text-[#D4AF37] text-sm bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            <FileAudio size={14} />
            <span>{fileName}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recording Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`flex items-center justify-center gap-3 px-6 py-8 rounded-lg border-2 transition-all duration-300
            ${disabled ? 'opacity-50 cursor-not-allowed border-[#222] text-[#444]' : 
              isRecording 
                ? 'border-[#B91C1C] text-[#B91C1C] bg-[#B91C1C]/10 animate-pulse' 
                : 'border-[#222] text-[#F5F5F5] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]'
            }`}
        >
          {isRecording ? <Square size={32} /> : <Mic size={32} />}
          <span className="font-cinzel text-lg">
            {isRecording ? "Stop Recording" : "Record Audio"}
          </span>
        </button>

        {/* Upload Button */}
        <label
          className={`relative flex items-center justify-center gap-3 px-6 py-8 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer
             ${disabled ? 'opacity-50 cursor-not-allowed border-[#222] text-[#444]' : 'border-[#222] text-[#F5F5F5] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'}`}
        >
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileUpload} 
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <Upload size={32} />
          <span className="font-cinzel text-lg">Upload Audio File</span>
        </label>
      </div>
      
      <p className="text-xs text-[#666] text-center mt-2">
        Supports MP3, WAV, M4A, WEBM. Analysis performed securely via Gemini 2.5 Flash.
      </p>
    </div>
  );
};

export default AudioInput;

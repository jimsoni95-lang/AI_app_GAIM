import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { SentimentPoint } from '../types';

interface SentimentGraphProps {
  data: SentimentPoint[];
}

export const SentimentGraph: React.FC<SentimentGraphProps> = ({ data }) => {
  return (
    <div className="w-full h-64 bg-[#0A0A0A] border border-[#222] rounded-lg p-4">
      <h3 className="text-[#F5F5F5] font-cinzel mb-4 text-sm border-b border-[#222] pb-2">Engagement & Sentiment Velocity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#666" 
            tick={{fill: '#666', fontSize: 10}} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            tick={{fill: '#666', fontSize: 10}} 
            tickLine={false}
            axisLine={false}
            domain={[-1, 1]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#D4AF37', color: '#F5F5F5' }}
            itemStyle={{ color: '#D4AF37' }}
          />
          <Area 
            type="monotone" 
            dataKey="sentiment_score" 
            stroke="#D4AF37" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSentiment)" 
          />
          <Line 
            type="monotone" 
            dataKey="engagement_score" 
            stroke="#888" 
            strokeWidth={1} 
            dot={false}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

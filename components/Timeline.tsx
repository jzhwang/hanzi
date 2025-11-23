import React from 'react';
import { EvolutionStage } from '../types';

interface TimelineProps {
  evolution: EvolutionStage[];
}

const Timeline: React.FC<TimelineProps> = ({ evolution }) => {
  return (
    <div className="py-4">
      <h3 className="text-xl font-serif font-bold text-ink-800 mb-6 border-b border-ink-200 pb-2 inline-block">
        字形演变
      </h3>
      <div className="relative border-l-2 border-ink-200 ml-3 space-y-8">
        {evolution.map((stage, index) => (
          <div key={index} className="relative pl-8 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-paper border-2 border-ink-600 rounded-full group-hover:bg-ink-600 transition-colors duration-300 z-10"></div>
            
            {/* Content Container */}
            <div className="transition-all duration-500 hover:translate-x-1">
              <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-paper bg-ink-700 rounded-sm font-serif">
                {stage.stage}
              </span>
              <p className="text-ink-600 text-sm leading-relaxed font-serif">
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
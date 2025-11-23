import React, { useEffect, useRef, useState } from 'react';

// Access the global HanziWriter variable loaded from the CDN
declare const HanziWriter: any;

interface StrokeOrderProps {
  character: string;
  size?: number;
}

const StrokeOrder: React.FC<StrokeOrderProps> = ({ character, size = 200 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState(''); // Feedback message

  useEffect(() => {
    if (!containerRef.current || !character) return;

    if (typeof HanziWriter === 'undefined') {
      console.warn("HanziWriter script not loaded.");
      setHasError(true);
      return;
    }

    // Clear previous content
    containerRef.current.innerHTML = '';
    setHasError(false);
    setMessage('');

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 10,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200, // ms
        strokeColor: '#3d3d3d', // ink-900
        outlineColor: '#d1d1d1', // ink-200
        radicalColor: '#b91c1c', // seal color for radical
        drawingWidth: 25, 
        highlightColor: '#b91c1c', // Color when hinting
        drawingColor: '#3d3d3d', // Color when user draws
        showHintAfterMisses: 1, // Hint after 1 mistake
        charDataLoader: (char: string, onComplete: any) => {
            const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`;
            fetch(url)
                .then(res => res.json())
                .then(onComplete)
                .catch(() => setHasError(true));
        }
      });
      
      writerRef.current = writer;

      // Animate once on load
      writer.animateCharacter();

    } catch (error) {
      console.error("HanziWriter init error:", error);
      setHasError(true);
    }
  }, [character, size]);

  const resetMode = () => {
      writerRef.current?.cancelQuiz();
      setMessage('');
  }

  const handleAnimate = () => {
    resetMode();
    writerRef.current?.animateCharacter();
  };

  const handleLoop = () => {
    resetMode();
    writerRef.current?.loopCharacterAnimation();
  };

  const handleQuiz = () => {
    resetMode();
    setMessage('请在方格内书写...');
    writerRef.current?.quiz({
        showHintAfterMisses: 1, // Hint immediately after 1 mistake as requested
        onMistake: (strokeData: any) => {
            setMessage(`笔顺错误，请注意提示 (第 ${strokeData.strokeNum + 1} 笔)`);
        },
        onCorrectStroke: (strokeData: any) => {
             // Calculate if it was the last stroke
             if (strokeData.strokeNum + 1 === writerRef.current._character.strokes.length) {
                 // Will be handled by onComplete
             } else {
                 setMessage(`正确！下一笔 (第 ${strokeData.strokeNum + 2} 笔)`);
             }
        },
        onComplete: (summaryData: any) => {
            setMessage(`练习完成！共 ${summaryData.totalMistakes} 处错误`);
            setTimeout(() => {
                writerRef.current?.animateCharacter();
            }, 1000);
        }
    });
  };

  if (hasError) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-ink-400 font-serif p-8">
            <p>暂无该字笔顺数据</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <div className="relative group select-none">
          {/* Main Drawing Container */}
          <div 
            ref={containerRef} 
            className="bg-paper border border-ink-100 rounded-sm shadow-inner cursor-pointer hover:shadow-md transition-shadow duration-300 relative z-10"
            // We keep it clickable to restart animation if not quizzing, but primarily controlled by buttons now
            title="汉字书写区"
          />
          
          {/* Background Grid Lines (Mi Zi Ge - Rice Grid) */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect x="0" y="0" width="100" height="100" fill="none" stroke="#b91c1c" strokeWidth="1" />
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#b91c1c" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#b91c1c" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#b91c1c" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#b91c1c" strokeWidth="0.5" strokeDasharray="5,5" />
              </svg>
          </div>
      </div>
      
      {/* Feedback Message Area */}
      <div className="h-6 mt-3 text-sm font-serif text-seal font-bold transition-all duration-300 min-w-[200px] text-center">
          {message}
      </div>

      <div className="flex gap-3 mt-3">
        <button 
            onClick={handleAnimate}
            className="px-4 py-1 text-xs border border-ink-300 rounded-full hover:bg-ink-800 hover:text-white hover:border-ink-800 transition-all text-ink-600 font-serif"
        >
            演示
        </button>
        <button 
            onClick={handleLoop}
            className="px-4 py-1 text-xs border border-ink-300 rounded-full hover:bg-ink-800 hover:text-white hover:border-ink-800 transition-all text-ink-600 font-serif"
        >
            循环
        </button>
        <button 
             onClick={handleQuiz}
             className="px-4 py-1 text-xs border border-seal text-seal rounded-full hover:bg-seal hover:text-white transition-all font-serif flex items-center gap-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            描红
        </button>
      </div>
    </div>
  );
};

export default StrokeOrder;
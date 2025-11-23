import React, { useState, useCallback } from 'react';
import { LoadingState, CharacterData } from './types';
import { analyzeCharacter } from './services/geminiService';
import InkBackground from './components/InkBackground';
import CharacterDetail from './components/CharacterDetail';
import Stamp from './components/Stamp';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ status: 'idle' });

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading({ status: 'loading' });
    setData(null);

    try {
      // Ensure we only take the first character if user types multiple
      const charToAnalyze = input.trim().charAt(0);
      const result = await analyzeCharacter(charToAnalyze);
      setData(result);
      setLoading({ status: 'success' });
    } catch (error) {
      console.error(error);
      setLoading({ status: 'error', message: '未能解析该字，请稍后再试。' });
    }
  }, [input]);

  return (
    <div className="min-h-screen relative font-sans selection:bg-seal selection:text-white">
      <InkBackground />

      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center relative z-10">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Stamp text="汉字" variant="solid" className="w-10 h-10 text-sm" />
            <h1 className="text-4xl md:text-5xl font-calligraphy text-ink-900 tracking-widest">
              墨韵 · 字源
            </h1>
            <Stamp text="源流" variant="outline" className="w-10 h-10 text-sm" />
          </div>
          <p className="text-ink-500 font-serif text-sm tracking-widest mt-2">
            探寻汉字之美，追溯千年墨迹
          </p>
        </div>
      </header>

      {/* Search Area - Shifts up when data is present */}
      <main className={`container mx-auto px-4 pb-16 transition-all duration-700 ease-in-out ${data ? 'mt-4' : 'mt-[15vh]'}`}>
        
        <div className="max-w-xl mx-auto mb-12 relative z-20">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1}
              placeholder="输入一个汉字..."
              className="w-full bg-white/80 backdrop-blur-md border-b-2 border-ink-300 text-center text-2xl py-4 px-6 font-serif text-ink-800 focus:outline-none focus:border-ink-800 transition-colors placeholder:text-ink-300 rounded-t-sm shadow-lg"
            />
            <button 
              type="submit"
              disabled={loading.status === 'loading' || !input}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-800 disabled:opacity-30 transition-colors p-2"
            >
               {/* Simple Brush Icon SVG */}
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.048 4.025a3 3 0 0 1-2.4-2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128m0 0a15.995 15.995 0 0 1-2.421-3.494m-5.165 3.127c.628.298 1.75.6 2.875.6.25 0 .5-.01.75-.03m1.15-5.55C11.5 13.5 11.5 9 15.5 9a1.5 1.5 0 0 0 1.5-1.5c0-2.336-2.24-4-5-4s-5 1.664-5 4a1.5 1.5 0 0 0 1.5 1.5c4 0 4 4.5 3.5 8.55M20.25 21.005c0 1.208-1.53 1.64-2.5 1.64-.53 0-1-.22-1.25-.55l-1.25-1.65a.75.75 0 0 1 .25-1.05l1.25-.75a.75.75 0 0 1 1.05.25l.9 1.2c.135.18.35.35.65.35.45 0 .85-.36.85-.95 0-1.1-.86-1.5-2.3-1.5a2.1 2.1 0 0 0-1.55.6l-.45.45a1.25 1.25 0 0 1-1.75 0l-.25-.25a1.25 1.25 0 0 1 0-1.75l.25-.25" />
              </svg>
            </button>
            {/* Bottom ink line animation */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-ink-800 w-0 group-hover:w-full group-focus-within:w-full transition-all duration-500"></div>
          </form>
          
          {/* Suggestions */}
          {!data && loading.status === 'idle' && (
             <div className="mt-4 flex justify-center gap-4 text-sm text-ink-400 font-serif">
               <span>推荐:</span>
               {['龙', '道', '禅', '雨', '墨'].map(char => (
                 <button key={char} onClick={() => { setInput(char); handleSearch(); }} className="hover:text-ink-800 underline decoration-1 underline-offset-4 decoration-ink-300 hover:decoration-ink-800 transition-all">
                   {char}
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* Loading State */}
        {loading.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
             {/* Sped up animation: animate-[spin_0.5s_linear_infinite] */}
             <div className="w-16 h-16 border-4 border-ink-200 border-t-ink-800 rounded-full animate-[spin_0.5s_linear_infinite] mb-4"></div>
             <p className="text-ink-600 font-serif text-lg tracking-widest">研墨中...</p>
          </div>
        )}

        {/* Error State */}
        {loading.status === 'error' && (
          <div className="text-center py-10 bg-red-50/50 rounded-lg border border-red-100 max-w-lg mx-auto">
            <p className="text-red-800 font-serif">{loading.message}</p>
          </div>
        )}

        {/* Content Display */}
        {loading.status === 'success' && data && (
          <CharacterDetail data={data} />
        )}
        
      </main>
      
      <footer className="absolute bottom-4 w-full text-center text-ink-300 text-xs font-serif opacity-60">
         © 2025 由Jessica制作
      </footer>
    </div>
  );
};

export default App;
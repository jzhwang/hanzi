import React, { useState, useRef } from 'react';
import { CharacterData } from '../types';
import Timeline from './Timeline';
import Stamp from './Stamp';
import StrokeOrder from './StrokeOrder';
import { generateSpeech } from '../services/geminiService';

interface CharacterDetailProps {
  data: CharacterData;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'calligraphy' | 'stroke'>('calligraphy');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null); // Stores the text currently being played/loading
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleReadAloud = async (text: string) => {
    if (playingAudio) return; // Prevent multiple clicks
    setPlayingAudio(text);

    try {
      const base64Audio = await generateSpeech(text);
      
      // Decode and play
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setPlayingAudio(null);
      source.start(0);

    } catch (error) {
      console.error("Audio playback error", error);
      setPlayingAudio(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      
      {/* Left Column: The Character & Basic Info */}
      <div className="lg:col-span-4 space-y-8">
        {/* Main Character Display Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-ink-200 p-8 shadow-sm rounded-sm flex flex-col items-center relative overflow-hidden min-h-[400px]">
            {/* View Toggle */}
            <div className="absolute top-3 left-3 z-20 flex bg-white/80 rounded-full p-1 border border-ink-200 backdrop-blur-md shadow-sm">
                <button 
                    onClick={() => setViewMode('calligraphy')}
                    className={`px-3 py-1 rounded-full text-xs font-serif transition-colors duration-300 ${viewMode === 'calligraphy' ? 'bg-ink-800 text-white' : 'text-ink-500 hover:bg-ink-100'}`}
                >
                    书法
                </button>
                <button 
                    onClick={() => setViewMode('stroke')}
                    className={`px-3 py-1 rounded-full text-xs font-serif transition-colors duration-300 ${viewMode === 'stroke' ? 'bg-ink-800 text-white' : 'text-ink-500 hover:bg-ink-100'}`}
                >
                    笔顺
                </button>
            </div>

            {/* Pinyin Display */}
            <div className="absolute top-4 w-full flex flex-wrap justify-center gap-3 z-10 px-12">
                {data.pinyin.map((py, index) => (
                  <span 
                      key={index}
                      className="px-3 py-1 bg-white/30 rounded-full backdrop-blur-[2px] font-serif text-xl text-ink-700 tracking-wider font-light border border-transparent cursor-default"
                  >
                      {py}
                  </span>
                ))}
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-2 right-2 opacity-50">
                 <Stamp text={data.type.substring(0, 1)} variant="outline" className="w-8 h-8 text-xs" />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center w-full py-4 mt-8">
                {viewMode === 'calligraphy' ? (
                    <div className="text-[10rem] leading-tight font-calligraphy text-ink-900 z-10 relative animate-fade-in-up">
                        {data.character}
                        <div className="absolute -bottom-4 -right-4 text-9xl text-ink-900 opacity-5 blur-sm select-none pointer-events-none">
                            {data.character}
                        </div>
                    </div>
                ) : (
                    <div className="z-10 w-full flex justify-center">
                        <StrokeOrder character={data.character} size={240} />
                    </div>
                )}
            </div>
            
            {/* Metadata Tags */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center w-full z-10">
                <span className="px-3 py-1 border border-ink-300 text-ink-600 text-sm rounded-full font-serif bg-white/50">
                    {data.type}
                </span>
                <span className="px-3 py-1 border border-ink-300 text-ink-600 text-sm rounded-full font-serif bg-white/50">
                    {data.structure}
                </span>
            </div>
        </div>

        {/* Basic Meaning */}
        <div className="bg-white/40 backdrop-blur-sm border-l-4 border-ink-800 p-6 rounded-r-sm">
            <h3 className="text-lg font-bold font-serif text-ink-900 mb-2">基本含义</h3>
            <p className="text-ink-700 font-serif leading-relaxed text-justify">
                {data.basic_meaning}
            </p>
        </div>

        {/* English Meaning & Examples */}
        <div className="bg-white/40 backdrop-blur-sm border-l-4 border-seal p-6 rounded-r-sm space-y-4">
             <div>
                <h3 className="text-lg font-bold font-serif text-ink-900 mb-1">
                  <span>英文单词</span>
                </h3>
                <p className="text-ink-700 font-serif leading-relaxed italic">
                    {data.english_meaning}
                </p>
            </div>
            
            <div>
               <h4 className="text-sm font-bold font-serif text-ink-500 mb-2 uppercase tracking-wider">Example Sentences</h4>
               <ul className="space-y-3">
                 {data.english_examples.map((ex, idx) => (
                   <li key={idx} className="text-sm font-serif">
                      <div className="flex gap-2 items-start text-ink-800 mb-1">
                          <button 
                            onClick={() => handleReadAloud(ex.sentence)}
                            className="mt-0.5 text-seal hover:text-red-700 flex-shrink-0 disabled:opacity-50"
                            disabled={playingAudio !== null}
                          >
                            {playingAudio === ex.sentence ? (
                                <div className="w-3 h-3 border-2 border-seal border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                                </svg>
                            )}
                          </button>
                          <span>{ex.sentence}</span>
                      </div>
                      <div className="text-ink-400 pl-6 text-xs">{ex.translation}</div>
                   </li>
                 ))}
               </ul>
            </div>
        </div>

         {/* Stroke Features */}
         <div className="bg-white/40 backdrop-blur-sm p-6 border border-ink-100 rounded-sm shadow-sm">
            <h3 className="text-lg font-bold font-serif text-ink-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-seal rounded-full"></span>
                书写要点
            </h3>
            <p className="text-ink-600 font-serif italic">
                {data.stroke_features}
            </p>
        </div>
      </div>

      {/* Middle Column: Etymology & Deep Dive */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-paper/80 p-8 rounded-sm shadow-lg border border-ink-100 relative">
            <div className="absolute -top-3 left-8 bg-ink-800 text-paper px-4 py-1 text-sm font-serif shadow-md">
                字源探微
            </div>
            <div className="mt-4 text-ink-800 font-serif text-lg leading-loose text-justify">
                {data.etymology}
            </div>
            {/* Decor */}
            <div className="absolute bottom-4 right-4 opacity-10">
                <div className="w-24 h-24 border-4 border-ink-900 rounded-full"></div>
            </div>
        </div>

        {/* Timeline */}
        <div className="bg-white/50 p-6 rounded-sm border border-ink-100">
            <Timeline evolution={data.evolution} />
        </div>
      </div>

      {/* Right Column: Rare Facts & Vertical Text */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-ink-900 text-ink-50 p-6 rounded-sm shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <h3 className="text-xl font-calligraphy text-seal mb-4 border-b border-ink-700 pb-2">
                拾遗 · 冷知
            </h3>
            <ul className="space-y-4 font-serif text-sm text-ink-300">
                {data.rare_features.map((fact, idx) => (
                    <li key={idx} className="flex gap-3">
                        <span className="text-seal font-bold">0{idx + 1}</span>
                        <span>{fact}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Artistic Vertical Filler */}
        <div className="hidden lg:flex flex-col items-center justify-center h-64 text-ink-200 writing-vertical font-calligraphy text-3xl tracking-[0.5em] opacity-40 select-none border-r border-ink-100 pr-4">
            {data.character}之韵 · 千年流转
        </div>
        
        <div className="flex justify-end mt-8">
            <Stamp text="墨韵" variant="solid" className="w-12 h-12 text-xl bg-seal text-white" />
        </div>
      </div>

    </div>
  );
};

export default CharacterDetail;
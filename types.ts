export interface EvolutionStage {
  stage: string; // e.g., "甲骨文", "金文"
  description: string;
}

export interface EnglishExample {
  sentence: string;
  translation: string;
}

export interface CharacterData {
  character: string;
  pinyin: string[];
  basic_meaning: string;
  english_meaning: string;
  english_examples: EnglishExample[];
  type: string; // e.g., "象形", "会意"
  etymology: string;
  evolution: EvolutionStage[];
  structure: string;
  stroke_features: string;
  rare_features: string[];
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}
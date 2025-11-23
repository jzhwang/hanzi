import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CharacterData } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("API_KEY is not defined in the environment.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });

export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is often good for English
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    throw new Error("No audio data received");
  } catch (error) {
    console.error("Speech generation failed:", error);
    throw error;
  }
};

export const analyzeCharacter = async (char: string): Promise<CharacterData> => {
  const modelId = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model: modelId,
    contents: `请分析汉字：“${char}”。
    
    请扮演一位专业的古文字学家和语言学家。我们需要该汉字的中文深度分析以及英文对应释义。
    
    需包含以下信息：
    1. 现代汉语常见含义及所有常见读音。
    2. 英文释义（English Meaning）：该字对应的常见英文单词或短语。
    3. 英文例句（English Examples）：提供3个使用该汉字核心概念的英文例句，并附带中文翻译。
    4. 造字法。
    5. 字源解释（给出理由）。
    6. 演变过程（甲骨文 → 金文 → 大篆 → 小篆 → 隶书 → 楷书）。
    7. 结构分析。
    8. 书写要点。
    9. 2-4条有趣且少见的冷知识。

    若汉字无确切甲骨文或金文形态，按文字学常识说明。
    语气要求：专业、古雅、准确。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          character: { type: Type.STRING },
          pinyin: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          basic_meaning: { type: Type.STRING },
          english_meaning: { type: Type.STRING, description: "Common English translations/definitions" },
          english_examples: {
            type: Type.ARRAY,
            description: "3 English sentences using the character's concept with translations",
            items: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING },
                translation: { type: Type.STRING }
              }
            }
          },
          type: { type: Type.STRING },
          etymology: { type: Type.STRING },
          evolution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["stage", "description"]
            }
          },
          structure: { type: Type.STRING },
          stroke_features: { type: Type.STRING },
          rare_features: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["character", "pinyin", "basic_meaning", "english_meaning", "english_examples", "type", "etymology", "evolution", "structure", "stroke_features", "rare_features"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as CharacterData;
  }

  throw new Error("Failed to generate character analysis.");
};
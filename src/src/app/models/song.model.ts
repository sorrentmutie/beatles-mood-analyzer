export type MoodType = 'euphoric' | 'melancholic' | 'energetic' | 'contemplative' | 'nostalgic' | 'rebellious' | 'romantic' | 'anxious';

export type AnalysisError = 'SONG_NOT_FOUND' | 'INVALID_SONG_DATA' | 'ANALYSIS_FAILED' | 'NETWORK_ERROR';

export interface Song {
  readonly id: number;
  readonly title: string;
  readonly album: string;
  readonly year?: number;
  readonly duration?: number;
  readonly tempo?: 'slow' | 'medium' | 'fast';
  readonly key?: string;
  readonly genre?: string;
  readonly moodCategory?: string;
}

export interface PsychologicalProfile {
  readonly dominantMood: MoodType;
  readonly confidence: number;
  readonly emotionalIntensity: number;
  readonly cognitiveLoad: number;
  readonly socialConnection: number;
}

export interface MoodAnalysis {
  readonly profile: PsychologicalProfile;
  readonly insights: readonly string[];
  readonly recommendations: readonly string[];
  readonly timestamp: Date;
}

export interface MoodResult {
  readonly type: MoodType;
  readonly emoji: string;
  readonly description: string;
  readonly color: string;
  readonly psychologicalBasis: string;
  readonly analysis: MoodAnalysis;
}

export interface AnalysisState {
  readonly isLoading: boolean;
  readonly error: AnalysisError | null;
  readonly result: MoodResult | null;
}
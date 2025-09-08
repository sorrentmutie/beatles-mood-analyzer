export interface Song {
  id: number;
  title: string;
  album: string;
  moodCategory: 'happy' | 'sad' | 'energetic' | 'peaceful' | 'nostalgic';
}

export interface MoodResult {
  type: string;
  emoji: string;
  description: string;
  color: string;
}
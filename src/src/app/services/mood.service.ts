import { Injectable } from '@angular/core';
import { MoodResult, Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private moodResults: { [key: string]: MoodResult } = {
    happy: {
      type: 'Happy',
      emoji: '😊',
      description: 'You\'re feeling joyful and optimistic! This Beatles classic brings sunshine to your day.',
      color: '#FFD700'
    },
    sad: {
      type: 'Sad',
      emoji: '😢',
      description: 'You\'re in a reflective, melancholic mood. Sometimes we all need a good cry with The Beatles.',
      color: '#4169E1'
    },
    energetic: {
      type: 'Energetic',
      emoji: '⚡',
      description: 'You\'re full of energy and ready to rock! These Beatles beats match your high spirits.',
      color: '#FF4500'
    },
    peaceful: {
      type: 'Peaceful',
      emoji: '🕊️',
      description: 'You\'re seeking calm and serenity. Let this Beatles song bring peace to your soul.',
      color: '#90EE90'
    },
    nostalgic: {
      type: 'Nostalgic',
      emoji: '🎭',
      description: 'You\'re reminiscing about the past. This Beatles song takes you on a journey through time.',
      color: '#DDA0DD'
    }
  };

  analyzeMood(song: Song): MoodResult {
    return this.moodResults[song.moodCategory];
  }

  getAllMoods(): MoodResult[] {
    return Object.values(this.moodResults);
  }
}
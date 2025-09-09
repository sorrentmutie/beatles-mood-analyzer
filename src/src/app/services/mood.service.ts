import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError, delay, tap, switchMap } from 'rxjs/operators';
import { 
  MoodResult, 
  Song, 
  MoodType, 
  PsychologicalProfile, 
  MoodAnalysis, 
  AnalysisState,
  AnalysisError
} from '../models/song.model';

interface AnalysisWeights {
  readonly tempo: number;
  readonly key: number;
  readonly lyricalContent: number;
  readonly historicalContext: number;
  readonly musicalComplexity: number;
}

interface PsychometricFactors {
  readonly valence: number;
  readonly arousal: number;
  readonly dominance: number;
  readonly openness: number;
  readonly neuroticism: number;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private readonly analysisState$ = new BehaviorSubject<AnalysisState>({
    isLoading: false,
    error: null,
    result: null
  });

  private readonly analysisWeights: AnalysisWeights = {
    tempo: 0.25,
    key: 0.20,
    lyricalContent: 0.30,
    historicalContext: 0.15,
    musicalComplexity: 0.10
  };

  private readonly songDatabase: ReadonlyMap<string, Partial<Song & { 
    lyrics: string[];
    musicalFeatures: PsychometricFactors;
  }>> = new Map([
    ['Yesterday', {
      tempo: 'slow',
      key: 'F major',
      year: 1965,
      lyrics: ['yesterday', 'love', 'away', 'trouble', 'seemed', 'far'],
      musicalFeatures: { valence: 0.2, arousal: 0.3, dominance: 0.4, openness: 0.7, neuroticism: 0.8 }
    }],
    ['Here Comes The Sun', {
      tempo: 'medium',
      key: 'A major',
      year: 1969,
      lyrics: ['sun', 'smile', 'little', 'darling', 'winter', 'long', 'cold'],
      musicalFeatures: { valence: 0.9, arousal: 0.6, dominance: 0.7, openness: 0.8, neuroticism: 0.2 }
    }],
    ['Come Together', {
      tempo: 'medium',
      key: 'D minor',
      year: 1969,
      lyrics: ['together', 'right', 'now', 'shoot', 'coca', 'cola'],
      musicalFeatures: { valence: 0.6, arousal: 0.8, dominance: 0.9, openness: 0.7, neuroticism: 0.3 }
    }]
  ]);

  getAnalysisState$(): Observable<AnalysisState> {
    return this.analysisState$.asObservable();
  }

  analyzeMood(song: Song): Observable<MoodResult> {
    this.updateAnalysisState({ isLoading: true, error: null, result: null });

    return this.validateSong(song).pipe(
      switchMap(() => this.performDeepAnalysis(song)),
      map(analysis => this.generateMoodResult(analysis)),
      tap(result => this.updateAnalysisState({ 
        isLoading: false, 
        error: null, 
        result 
      })),
      catchError(error => this.handleAnalysisError(error))
    );
  }

  private validateSong(song: Song): Observable<Song> {
    if (!song || !song.title || !song.album) {
      return throwError(() => 'INVALID_SONG_DATA');
    }
    
    if (song.id < 0) {
      return throwError(() => 'SONG_NOT_FOUND');
    }

    return of(song);
  }

  private performDeepAnalysis(song: Song): Observable<MoodAnalysis> {
    return combineLatest([
      this.analyzeLyricalContent(song),
      this.analyzeMusicalFeatures(song),
      this.analyzeHistoricalContext(song),
      this.computePsychologicalProfile(song)
    ]).pipe(
      delay(1200),
      map(([lyricalFactors, musicalFactors, contextFactors, profile]) => ({
        profile,
        insights: this.generateInsights(song, profile, lyricalFactors, musicalFactors),
        recommendations: this.generateRecommendations(profile),
        timestamp: new Date()
      }))
    );
  }

  private analyzeLyricalContent(song: Song): Observable<PsychometricFactors> {
    const songData = this.songDatabase.get(song.title);
    const lyrics = songData?.lyrics || [];
    
    const positiveWords = ['love', 'sun', 'smile', 'happy', 'joy', 'together'];
    const negativeWords = ['trouble', 'sad', 'pain', 'cry', 'alone', 'winter'];
    const energeticWords = ['rock', 'dance', 'fast', 'energy', 'power', 'strong'];
    
    const positiveScore = lyrics.filter(word => positiveWords.includes(word)).length;
    const negativeScore = lyrics.filter(word => negativeWords.includes(word)).length;
    const energeticScore = lyrics.filter(word => energeticWords.includes(word)).length;
    
    const totalWords = lyrics.length || 1;
    
    return of({
      valence: Math.max(0.1, Math.min(0.9, (positiveScore - negativeScore) / totalWords + 0.5)),
      arousal: Math.max(0.1, Math.min(0.9, energeticScore / totalWords + 0.3)),
      dominance: Math.max(0.1, Math.min(0.9, energeticScore / totalWords + 0.4)),
      openness: Math.max(0.3, Math.min(0.9, positiveScore / totalWords + 0.5)),
      neuroticism: Math.max(0.1, Math.min(0.8, negativeScore / totalWords + 0.2))
    });
  }

  private analyzeMusicalFeatures(song: Song): Observable<PsychometricFactors> {
    const songData = this.songDatabase.get(song.title);
    
    if (songData?.musicalFeatures) {
      return of(songData.musicalFeatures);
    }

    const tempoMapping = { slow: 0.3, medium: 0.6, fast: 0.9 };
    const arousal = tempoMapping[song.tempo || 'medium'];
    
    return of({
      valence: 0.5,
      arousal,
      dominance: 0.5,
      openness: 0.6,
      neuroticism: 0.3
    });
  }

  private analyzeHistoricalContext(song: Song): Observable<number> {
    const year = song.year || 1965;
    const eraFactors = {
      early: year < 1965 ? 0.8 : 0,
      middle: year >= 1965 && year < 1968 ? 0.9 : 0,
      late: year >= 1968 ? 0.7 : 0
    };
    
    const contextScore = Math.max(...Object.values(eraFactors));
    return of(contextScore);
  }

  private computePsychologicalProfile(song: Song): Observable<PsychologicalProfile> {
    return combineLatest([
      this.analyzeLyricalContent(song),
      this.analyzeMusicalFeatures(song)
    ]).pipe(
      map(([lyrical, musical]) => {
        const avgValence = (lyrical.valence + musical.valence) / 2;
        const avgArousal = (lyrical.arousal + musical.arousal) / 2;
        
        let dominantMood: MoodType;
        
        if (avgValence > 0.7 && avgArousal > 0.6) {
          dominantMood = 'euphoric';
        } else if (avgValence < 0.3) {
          dominantMood = avgArousal < 0.4 ? 'melancholic' : 'anxious';
        } else if (avgArousal > 0.7) {
          dominantMood = 'energetic';
        } else if (avgValence > 0.6 && avgArousal < 0.5) {
          dominantMood = 'contemplative';
        } else if (lyrical.neuroticism < 0.3 && avgValence > 0.5) {
          dominantMood = 'romantic';
        } else if (musical.dominance > 0.7) {
          dominantMood = 'rebellious';
        } else {
          dominantMood = 'nostalgic';
        }

        return {
          dominantMood,
          confidence: Math.min(0.95, Math.max(0.6, avgValence + avgArousal) * 0.8 + 0.2),
          emotionalIntensity: Math.max(0.1, Math.min(1.0, avgArousal + Math.abs(avgValence - 0.5))),
          cognitiveLoad: Math.max(0.2, Math.min(0.9, (lyrical.openness + musical.dominance) / 2)),
          socialConnection: Math.max(0.1, Math.min(0.9, avgValence * (1 - lyrical.neuroticism)))
        };
      })
    );
  }

  private generateInsights(
    song: Song, 
    profile: PsychologicalProfile,
    lyrical: PsychometricFactors,
    musical: PsychometricFactors
  ): readonly string[] {
    const insights: string[] = [];
    
    if (profile.confidence > 0.8) {
      insights.push(`High confidence analysis: Your psychological profile shows strong ${profile.dominantMood} tendencies.`);
    }
    
    if (profile.emotionalIntensity > 0.7) {
      insights.push(`This song evokes intense emotional responses, suggesting deep psychological resonance with your current state.`);
    }
    
    if (profile.cognitiveLoad > 0.6) {
      insights.push(`The musical complexity indicates you're seeking intellectual stimulation through artistic expression.`);
    }
    
    if (profile.socialConnection > 0.7) {
      insights.push(`Strong social connection factors suggest you're in a mood for shared experiences and community.`);
    } else if (profile.socialConnection < 0.4) {
      insights.push(`Lower social connection scores indicate a preference for introspection and solitary reflection.`);
    }

    if (lyrical.valence > musical.valence) {
      insights.push(`The lyrics resonate more strongly than the music, suggesting word-based emotional processing.`);
    } else if (musical.valence > lyrical.valence) {
      insights.push(`The musical elements dominate your emotional response, indicating melody-driven mood patterns.`);
    }
    
    return insights;
  }

  private generateRecommendations(profile: PsychologicalProfile): readonly string[] {
    const recommendations: string[] = [];
    
    switch (profile.dominantMood) {
      case 'euphoric':
        recommendations.push('Channel this positive energy into creative projects or social activities.');
        recommendations.push('Consider sharing your joy with others through music or art.');
        break;
      case 'melancholic':
        recommendations.push('Allow yourself time for reflection and emotional processing.');
        recommendations.push('Consider journaling or meditative practices to work through complex feelings.');
        break;
      case 'energetic':
        recommendations.push('Use this energy burst for physical activities or challenging tasks.');
        recommendations.push('Consider dance, exercise, or tackling that project you\'ve been postponing.');
        break;
      case 'contemplative':
        recommendations.push('This is an ideal time for deep thinking and philosophical exploration.');
        recommendations.push('Consider reading, studying, or engaging in meaningful conversations.');
        break;
      case 'nostalgic':
        recommendations.push('Embrace these memories while staying grounded in the present.');
        recommendations.push('Consider reconnecting with old friends or revisiting meaningful places.');
        break;
      case 'rebellious':
        recommendations.push('Channel this assertive energy into positive change and self-advocacy.');
        recommendations.push('Consider standing up for your values or pursuing unconventional goals.');
        break;
      case 'romantic':
        recommendations.push('Express your affection and appreciation to those you care about.');
        recommendations.push('Consider romantic gestures or intimate conversations with loved ones.');
        break;
      case 'anxious':
        recommendations.push('Practice grounding techniques and mindful breathing exercises.');
        recommendations.push('Consider gentle activities that promote calm and emotional regulation.');
        break;
    }
    
    if (profile.emotionalIntensity > 0.7) {
      recommendations.push('Given the high emotional intensity, consider balancing activities to maintain well-being.');
    }
    
    return recommendations;
  }

  private generateMoodResult(analysis: MoodAnalysis): MoodResult {
    const { profile } = analysis;
    const moodConfigs = this.getMoodConfigurations();
    const config = moodConfigs[profile.dominantMood];
    
    return {
      ...config,
      analysis
    };
  }

  private getMoodConfigurations(): Record<MoodType, Omit<MoodResult, 'analysis'>> {
    return {
      euphoric: {
        type: 'euphoric',
        emoji: '🌟',
        description: 'You\'re experiencing profound joy and elevated consciousness. This Beatles masterpiece amplifies your transcendent emotional state.',
        color: '#FFD700',
        psychologicalBasis: 'High positive valence with elevated arousal indicates optimal psychological well-being and peak emotional experience.'
      },
      melancholic: {
        type: 'melancholic',
        emoji: '🌧️',
        description: 'You\'re processing deep, complex emotions with introspective wisdom. This song provides a safe space for emotional exploration.',
        color: '#6B8CAE',
        psychologicalBasis: 'Low valence with moderate arousal suggests healthy emotional processing and adaptive coping with difficult feelings.'
      },
      energetic: {
        type: 'energetic',
        emoji: '⚡',
        description: 'Your psychological system is primed for action and achievement. This Beatles track matches your dynamic motivational state.',
        color: '#FF6B35',
        psychologicalBasis: 'High arousal with positive valence indicates optimal performance readiness and goal-directed behavior activation.'
      },
      contemplative: {
        type: 'contemplative',
        emoji: '🤔',
        description: 'You\'re in a state of philosophical reflection and deep cognitive processing. This music supports your intellectual journey.',
        color: '#9B7EDE',
        psychologicalBasis: 'Moderate valence with low arousal suggests active cognitive engagement and reflective mental processing.'
      },
      nostalgic: {
        type: 'nostalgic',
        emoji: '🕰️',
        description: 'Your psyche is integrating past experiences with present awareness. This song bridges temporal emotional connections.',
        color: '#D4A574',
        psychologicalBasis: 'Mixed valence with temporal focus indicates healthy memory consolidation and identity integration processes.'
      },
      rebellious: {
        type: 'rebellious',
        emoji: '🔥',
        description: 'You\'re asserting psychological autonomy and challenging conventional boundaries. This track empowers your authentic self-expression.',
        color: '#E74C3C',
        psychologicalBasis: 'High dominance with assertive arousal indicates healthy self-advocacy and personal boundary establishment.'
      },
      romantic: {
        type: 'romantic',
        emoji: '💕',
        description: 'Your attachment system is activated for deep emotional bonding. This Beatles classic enhances interpersonal connection capacity.',
        color: '#FF69B4',
        psychologicalBasis: 'High valence with moderate arousal in social contexts indicates optimal conditions for pair bonding and intimacy.'
      },
      anxious: {
        type: 'anxious',
        emoji: '😰',
        description: 'Your nervous system is processing stress signals that require gentle attention. This music can help regulate emotional intensity.',
        color: '#F39C12',
        psychologicalBasis: 'High arousal with negative valence suggests activated stress response requiring emotional regulation and support.'
      }
    };
  }

  private handleAnalysisError(error: unknown): Observable<never> {
    let analysisError: AnalysisError;
    
    if (typeof error === 'string') {
      analysisError = error as AnalysisError;
    } else if (error instanceof Error) {
      analysisError = 'ANALYSIS_FAILED';
    } else {
      analysisError = 'ANALYSIS_FAILED';
    }

    this.updateAnalysisState({ 
      isLoading: false, 
      error: analysisError, 
      result: null 
    });

    return throwError(() => analysisError);
  }

  private updateAnalysisState(update: Partial<AnalysisState>): void {
    const currentState = this.analysisState$.value;
    this.analysisState$.next({ ...currentState, ...update });
  }

  getAllMoodTypes$(): Observable<readonly MoodType[]> {
    return of(['euphoric', 'melancholic', 'energetic', 'contemplative', 'nostalgic', 'rebellious', 'romantic', 'anxious']);
  }

  getMoodConfiguration$(moodType: MoodType): Observable<Omit<MoodResult, 'analysis'>> {
    const configs = this.getMoodConfigurations();
    const config = configs[moodType];
    
    if (!config) {
      return throwError(() => 'INVALID_MOOD_TYPE');
    }
    
    return of(config);
  }
}
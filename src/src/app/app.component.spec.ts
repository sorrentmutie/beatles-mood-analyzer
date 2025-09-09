import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MoodService } from './services/mood.service';
import { of } from 'rxjs';
import { MoodResult, Song } from './models/song.model';

describe('AppComponent', () => {
  let mockMoodService: jasmine.SpyObj<MoodService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MoodService', ['analyzeMood']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MoodService, useValue: spy }
      ]
    }).compileComponents();

    mockMoodService = TestBed.inject(MoodService) as jasmine.SpyObj<MoodService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Beatles Mood Analyzer');
  });

  it('should initialize with null selected song and mood result', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.selectedSong).toBeNull();
    expect(app.moodResult).toBeNull();
  });

  it('should call mood service when song is selected', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    const testSong: Song = { id: 1, title: 'Hey Jude', album: 'Hey Jude', year: 1968 };
    const testMoodResult: MoodResult = {
      type: 'euphoric',
      emoji: '😊',
      description: 'Uplifting and joyful',
      color: '#FFD700',
      psychologicalBasis: 'Test basis',
      analysis: {
        profile: {
          dominantMood: 'euphoric',
          confidence: 0.8,
          emotionalIntensity: 0.7,
          cognitiveLoad: 0.5,
          socialConnection: 0.9
        },
        insights: ['Test insight'],
        recommendations: ['Test recommendation'],
        timestamp: new Date()
      }
    };
    
    mockMoodService.analyzeMood.and.returnValue(of(testMoodResult));
    
    app.onSongSelected(testSong);
    
    expect(mockMoodService.analyzeMood).toHaveBeenCalledWith(testSong);
    expect(app.selectedSong).toEqual(testSong);
    expect(app.moodResult).toEqual(testMoodResult);
  });
});

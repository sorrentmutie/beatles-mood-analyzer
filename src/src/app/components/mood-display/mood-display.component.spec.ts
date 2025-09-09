import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MoodDisplayComponent } from './mood-display.component';
import { MoodResult, Song } from '../../models/song.model';

describe('MoodDisplayComponent', () => {
  let component: MoodDisplayComponent;
  let fixture: ComponentFixture<MoodDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodDisplayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MoodDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null values', () => {
    expect(component.selectedSong).toBeNull();
    expect(component.moodResult).toBeNull();
  });

  it('should show no selection message when no song is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Select a Beatles song above to discover your mood!');
  });

  it('should display mood result only when both song and mood are provided', () => {
    const testSong: Song = { 
      id: 1, 
      title: 'Hey Jude', 
      album: 'Hey Jude', 
      year: 1968 
    };
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
    
    component.selectedSong = testSong;
    component.moodResult = testMoodResult;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hey Jude');
    expect(compiled.textContent).toContain('euphoric');
    expect(compiled.textContent).toContain('Uplifting and joyful');
  });

  it('should handle both song and mood result together', () => {
    const testSong: Song = { 
      id: 1, 
      title: 'Yesterday', 
      album: 'Help!', 
      year: 1965 
    };
    const testMoodResult: MoodResult = {
      type: 'melancholic',
      emoji: '😔',
      description: 'Nostalgic and reflective',
      color: '#4169E1',
      psychologicalBasis: 'Test basis',
      analysis: {
        profile: {
          dominantMood: 'melancholic',
          confidence: 0.9,
          emotionalIntensity: 0.8,
          cognitiveLoad: 0.6,
          socialConnection: 0.4
        },
        insights: ['Test insight'],
        recommendations: ['Test recommendation'],
        timestamp: new Date()
      }
    };
    
    component.selectedSong = testSong;
    component.moodResult = testMoodResult;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Yesterday');
    expect(compiled.textContent).toContain('melancholic');
  });
});
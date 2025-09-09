# API Documentation

## Overview

This document provides comprehensive API documentation for the Beatles Mood Analyzer application services and components. The application follows Angular's dependency injection system and reactive programming patterns using RxJS observables.

## Table of Contents

- [Services](#services)
  - [MoodService](#moodservice)
  - [SongService](#songservice)
  - [ThemeService](#themeservice)
- [Components](#components)
  - [AppComponent](#appcomponent)
  - [SongSelectorComponent](#songselectorcomponent)
  - [MoodDisplayComponent](#mooddisplaycomponent)
  - [ThemeToggleComponent](#themetogglecomponent)
- [Models and Interfaces](#models-and-interfaces)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

## Services

### MoodService

**File**: `src/app/services/mood.service.ts`

The core service responsible for sophisticated mood analysis based on Beatles song selections.

#### Injectable Configuration
```typescript
@Injectable({
  providedIn: 'root'
})
```

#### Public Methods

##### `analyzeMood(song: Song): Observable<MoodResult>`

Performs comprehensive mood analysis on a selected Beatles song.

**Parameters:**
- `song: Song` - The song object to analyze

**Returns:**
- `Observable<MoodResult>` - Stream containing the mood analysis result

**Example:**
```typescript
this.moodService.analyzeMood(selectedSong).subscribe({
  next: (result) => {
    console.log('Mood analysis result:', result);
    this.displayMoodResult(result);
  },
  error: (error) => {
    console.error('Analysis failed:', error);
    this.handleAnalysisError(error);
  }
});
```

**Analysis Pipeline:**
1. Song validation
2. Parallel psychometric analysis:
   - Lyrical content analysis
   - Musical feature extraction
   - Historical context evaluation
   - Psychological profiling
3. Result synthesis and confidence scoring
4. State management update

##### `getAnalysisState$(): Observable<AnalysisState>`

Returns an observable stream of the current analysis state.

**Returns:**
- `Observable<AnalysisState>` - Stream of analysis state updates

**Example:**
```typescript
this.moodService.getAnalysisState$().subscribe(state => {
  if (state.isLoading) {
    this.showLoadingSpinner();
  } else if (state.error) {
    this.showError(state.error);
  } else if (state.result) {
    this.displayResult(state.result);
  }
});
```

##### `getAllMoodTypes$(): Observable<readonly MoodType[]>`

Returns all available mood type classifications.

**Returns:**
- `Observable<readonly MoodType[]>` - Array of mood types

**Example:**
```typescript
this.moodService.getAllMoodTypes$().subscribe(moodTypes => {
  console.log('Available mood types:', moodTypes);
  // ['euphoric', 'melancholic', 'energetic', ...]
});
```

##### `getMoodConfiguration$(moodType: MoodType): Observable<MoodResult>`

Retrieves configuration details for a specific mood type.

**Parameters:**
- `moodType: MoodType` - The mood type to query

**Returns:**
- `Observable<MoodResult>` - Configuration without analysis data

**Example:**
```typescript
this.moodService.getMoodConfiguration$('euphoric').subscribe(config => {
  console.log('Euphoric mood config:', config);
  // { type: 'euphoric', emoji: '🌟', description: '...', ... }
});
```

#### Private Methods

##### Analysis Pipeline Methods

```typescript
private validateSong(song: Song): Observable<Song>
private performDeepAnalysis(song: Song): Observable<MoodAnalysis>
private analyzeLyricalContent(song: Song): Observable<PsychometricFactors>
private analyzeMusicalFeatures(song: Song): Observable<PsychometricFactors>
private analyzeHistoricalContext(song: Song): Observable<number>
private computePsychologicalProfile(song: Song): Observable<PsychologicalProfile>
private generateInsights(song: Song, profile: PsychologicalProfile, lyrical: PsychometricFactors, musical: PsychometricFactors): readonly string[]
private generateRecommendations(profile: PsychologicalProfile): readonly string[]
private generateMoodResult(analysis: MoodAnalysis): MoodResult
private handleAnalysisError(error: unknown): Observable<never>
```

#### Configuration

##### Analysis Weights
```typescript
private readonly analysisWeights: AnalysisWeights = {
  tempo: 0.25,              // Musical rhythm impact
  key: 0.20,                // Harmonic emotional influence
  lyricalContent: 0.30,     // Semantic emotional content
  historicalContext: 0.15,  // Era-based psychological factors
  musicalComplexity: 0.10   // Structural complexity impact
};
```

##### Song Database
Internal database with psychometric profiles for Beatles songs:
```typescript
private readonly songDatabase: ReadonlyMap<string, Partial<Song & { 
  lyrics: string[];
  musicalFeatures: PsychometricFactors;
}>>
```

---

### SongService

**File**: `src/app/services/song.service.ts`

Manages the Beatles song database and provides song data access.

#### Injectable Configuration
```typescript
@Injectable({
  providedIn: 'root'
})
```

#### Public Methods

##### `getSongs(): Song[]`

Retrieves all available Beatles songs from the database.

**Returns:**
- `Song[]` - Array of all song objects

**Example:**
```typescript
const allSongs = this.songService.getSongs();
console.log(`Found ${allSongs.length} Beatles songs`);

allSongs.forEach(song => {
  console.log(`${song.title} from ${song.album} (${song.year})`);
});
```

##### `getSongById(id: number): Song | undefined`

Retrieves a specific song by its unique identifier.

**Parameters:**
- `id: number` - The song's unique ID

**Returns:**
- `Song | undefined` - Song object if found, undefined otherwise

**Example:**
```typescript
const song = this.songService.getSongById(1);
if (song) {
  console.log(`Found: ${song.title}`);
  this.analyzeMood(song);
} else {
  console.error('Song not found');
}
```

#### Song Database Schema

The service maintains a curated collection of 12 Beatles songs:

| ID | Title | Album | Year | Mood Category |
|----|-------|-------|------|---------------|
| 1 | Here Comes The Sun | Abbey Road | 1969 | happy |
| 2 | Yesterday | Help! | 1965 | sad |
| 3 | Twist and Shout | Please Please Me | 1963 | energetic |
| 4 | Let It Be | Let It Be | 1970 | peaceful |
| 5 | In My Life | Rubber Soul | 1965 | nostalgic |
| 6 | Hey Jude | Single | 1968 | happy |
| 7 | Eleanor Rigby | Revolver | 1966 | sad |
| 8 | Come Together | Abbey Road | 1969 | energetic |
| 9 | The Long and Winding Road | Let It Be | 1970 | nostalgic |
| 10 | Blackbird | The Beatles (White Album) | 1968 | peaceful |
| 11 | I Want to Hold Your Hand | Meet The Beatles! | 1963 | happy |
| 12 | While My Guitar Gently Weeps | The Beatles (White Album) | 1968 | sad |

---

### ThemeService

**File**: `src/app/services/theme.service.ts`

Manages application theming with automatic system detection and persistence.

#### Injectable Configuration
```typescript
@Injectable({
  providedIn: 'root'
})
```

#### Public Properties

##### `currentTheme$: Observable<Theme>`

Observable stream of theme changes.

**Returns:**
- `Observable<Theme>` - Current theme state

**Example:**
```typescript
this.themeService.currentTheme$.subscribe(theme => {
  console.log(`Theme changed to: ${theme}`);
  this.updateUIForTheme(theme);
});
```

##### `currentTheme: Theme`

Synchronous getter for current theme.

**Returns:**
- `Theme` - Current theme ('light' | 'dark')

**Example:**
```typescript
const currentTheme = this.themeService.currentTheme;
if (currentTheme === 'dark') {
  this.applyDarkModeStyles();
}
```

#### Public Methods

##### `toggleTheme(): void`

Switches between light and dark themes.

**Example:**
```typescript
// Toggle theme on button click
onThemeToggle() {
  this.themeService.toggleTheme();
  // Theme automatically persisted to localStorage
}
```

##### `setTheme(theme: Theme): void`

Sets a specific theme directly.

**Parameters:**
- `theme: Theme` - Theme to set ('light' | 'dark')

**Example:**
```typescript
// Set theme based on user preference
this.themeService.setTheme('dark');

// Set theme based on time of day
const hour = new Date().getHours();
const theme = hour >= 18 || hour <= 6 ? 'dark' : 'light';
this.themeService.setTheme(theme);
```

#### Theme Detection Strategy

1. **Local Storage Check**: `localStorage.getItem('beatles-mood-analyzer-theme')`
2. **System Preference**: `window.matchMedia('(prefers-color-scheme: dark)')`
3. **Default Fallback**: 'light' theme

#### CSS Custom Properties Applied

The service applies the following CSS custom properties:

**Light Theme:**
```css
:root {
  --primary-color: #2c3e50;
  --accent-color: #3498db;
  --background-color: #ffffff;
  --text-color: #2c3e50;
}
```

**Dark Theme:**
```css
[data-theme="dark"] {
  --primary-color: #ecf0f1;
  --accent-color: #5dade2;
  --background-color: #1a1a1a;
  --text-color: #ecf0f1;
}
```

---

## Components

### AppComponent

**File**: `src/app/app.component.ts`

Root application component that orchestrates the main application flow.

#### Component Configuration
```typescript
@Component({
  selector: 'app-root',
  imports: [SongSelectorComponent, MoodDisplayComponent, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
```

#### Properties

```typescript
title: string = 'Beatles Mood Analyzer'
selectedSong: Song | null = null
moodResult: MoodResult | null = null
```

#### Constructor Dependencies

```typescript
constructor(private moodService: MoodService)
```

#### Methods

##### `onSongSelected(song: Song): void`

Handles song selection events from the song selector component.

**Parameters:**
- `song: Song` - The selected song

**Behavior:**
- Updates `selectedSong` property
- Triggers mood analysis via `MoodService`
- Updates `moodResult` when analysis completes

**Example Template Usage:**
```html
<app-song-selector 
  (songSelected)="onSongSelected($event)">
</app-song-selector>
```

---

### SongSelectorComponent

**File**: `src/app/components/song-selector/song-selector.component.ts`

Component responsible for displaying available Beatles songs and handling user selection.

#### Component Configuration
```typescript
@Component({
  selector: 'app-song-selector',
  templateUrl: './song-selector.component.html',
  styleUrl: './song-selector.component.css'
})
```

#### Output Events

##### `@Output() songSelected: EventEmitter<Song>`

Emitted when a user selects a song.

**Event Data:**
- `Song` - The selected song object

**Example Parent Usage:**
```html
<app-song-selector 
  (songSelected)="handleSongSelection($event)">
</app-song-selector>
```

#### Properties

```typescript
songs: Song[]           // Available songs from SongService
selectedSongId: number | null  // Currently selected song ID
```

#### Constructor Dependencies

```typescript
constructor(private songService: SongService)
```

#### Methods

##### `ngOnInit(): void`

Initializes the component and loads available songs.

##### `selectSong(song: Song): void`

Handles song selection and emits the selection event.

**Parameters:**
- `song: Song` - The song to select

---

### MoodDisplayComponent

**File**: `src/app/components/mood-display/mood-display.component.ts`

Component that displays mood analysis results with visual feedback.

#### Component Configuration
```typescript
@Component({
  selector: 'app-mood-display',
  templateUrl: './mood-display.component.html',
  styleUrl: './mood-display.component.css'
})
```

#### Input Properties

##### `@Input() selectedSong: Song | null`

The currently selected song for analysis.

##### `@Input() moodResult: MoodResult | null`

The mood analysis result to display.

#### Properties

```typescript
isLoading: boolean = false
error: string | null = null
```

#### Methods

##### `ngOnChanges(changes: SimpleChanges): void`

Responds to input property changes and updates display accordingly.

##### `getEmoji(): string`

Returns the appropriate emoji for the current mood.

##### `getDescription(): string`

Returns the mood description text.

##### `getInsights(): readonly string[]`

Returns psychological insights from the analysis.

##### `getRecommendations(): readonly string[]`

Returns behavioral recommendations based on the mood analysis.

---

### ThemeToggleComponent

**File**: `src/app/components/theme-toggle/theme-toggle.component.ts`

Component providing theme switching functionality.

#### Component Configuration
```typescript
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
```

#### Properties

```typescript
currentTheme$: Observable<Theme>  // Current theme observable
```

#### Constructor Dependencies

```typescript
constructor(private themeService: ThemeService)
```

#### Methods

##### `ngOnInit(): void`

Initializes the component and subscribes to theme changes.

##### `toggleTheme(): void`

Handles theme toggle button clicks.

**Example Template:**
```html
<button (click)="toggleTheme()" 
        [attr.aria-label]="'Switch to ' + (currentTheme === 'light' ? 'dark' : 'light') + ' theme'">
  <span>{{ currentTheme === 'light' ? '🌙' : '☀️' }}</span>
</button>
```

---

## Models and Interfaces

### Core Type Definitions

#### MoodType
```typescript
type MoodType = 
  | 'euphoric'      // High positive valence with elevated arousal
  | 'melancholic'   // Low valence with introspective processing
  | 'energetic'     // High arousal with positive motivation
  | 'contemplative' // Moderate valence with cognitive engagement
  | 'nostalgic'     // Temporal focus with mixed emotional valence
  | 'rebellious'    // High dominance with assertive expression
  | 'romantic'      // High valence optimized for social bonding
  | 'anxious';      // High arousal with stress response activation
```

#### Theme
```typescript
type Theme = 'light' | 'dark';
```

#### AnalysisError
```typescript
type AnalysisError = 
  | 'SONG_NOT_FOUND'     // Song ID not found in database
  | 'INVALID_SONG_DATA'  // Song object validation failed
  | 'ANALYSIS_FAILED'    // General analysis processing error
  | 'NETWORK_ERROR';     // Network-related error (future use)
```

### Interface Definitions

#### Song
```typescript
interface Song {
  readonly id: number;           // Unique identifier
  readonly title: string;        // Song title
  readonly album: string;        // Album name
  readonly year?: number;        // Release year (optional)
  readonly duration?: number;    // Song length in seconds (optional)
  readonly tempo?: 'slow' | 'medium' | 'fast'; // Tempo classification
  readonly key?: string;         // Musical key (e.g., 'F major')
  readonly genre?: string;       // Musical genre (optional)
  readonly moodCategory?: string; // Primary mood classification
}
```

#### PsychologicalProfile
```typescript
interface PsychologicalProfile {
  readonly dominantMood: MoodType;        // Primary mood classification
  readonly confidence: number;            // Analysis confidence (0-1)
  readonly emotionalIntensity: number;    // Emotional activation level (0-1)
  readonly cognitiveLoad: number;         // Mental processing requirement (0-1)
  readonly socialConnection: number;      // Social engagement factor (0-1)
}
```

#### MoodAnalysis
```typescript
interface MoodAnalysis {
  readonly profile: PsychologicalProfile;      // Psychological profiling results
  readonly insights: readonly string[];        // Psychological insights array
  readonly recommendations: readonly string[];  // Behavioral recommendations
  readonly timestamp: Date;                    // Analysis timestamp
}
```

#### MoodResult
```typescript
interface MoodResult {
  readonly type: MoodType;              // Mood classification
  readonly emoji: string;               // Visual emoji representation
  readonly description: string;         // Detailed mood description
  readonly color: string;               // Associated color (hex code)
  readonly psychologicalBasis: string;  // Scientific explanation
  readonly analysis: MoodAnalysis;      // Complete analysis data
}
```

#### AnalysisState
```typescript
interface AnalysisState {
  readonly isLoading: boolean;           // Loading state flag
  readonly error: AnalysisError | null;  // Error state
  readonly result: MoodResult | null;    // Analysis result
}
```

#### PsychometricFactors
```typescript
interface PsychometricFactors {
  readonly valence: number;      // Emotional positivity (-1 to +1)
  readonly arousal: number;      // Energy/activation level (0 to 1)
  readonly dominance: number;    // Control/influence (0 to 1)
  readonly openness: number;     // Experience receptivity (0 to 1)
  readonly neuroticism: number;  // Emotional stability (0 to 1)
}
```

---

## Error Handling

### Error Types and Responses

#### SONG_NOT_FOUND
**Cause:** Song ID not found in the database
**Response:** Display user-friendly error message
**Recovery:** Allow user to select a different song

#### INVALID_SONG_DATA
**Cause:** Song object validation failed
**Response:** Log error details, show generic error message
**Recovery:** Reset selection state

#### ANALYSIS_FAILED
**Cause:** General processing error during mood analysis
**Response:** Show analysis failed message
**Recovery:** Allow user to retry analysis

### Error Handling Pattern

```typescript
// Service level error handling
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

// Component level error handling
onSongSelected(song: Song): void {
  this.selectedSong = song;
  this.moodService.analyzeMood(song).subscribe({
    next: result => this.moodResult = result,
    error: error => this.handleError(error)
  });
}

private handleError(error: AnalysisError): void {
  switch (error) {
    case 'SONG_NOT_FOUND':
      this.showMessage('Song not found. Please select another song.');
      break;
    case 'INVALID_SONG_DATA':
      this.showMessage('Invalid song data. Please try again.');
      break;
    case 'ANALYSIS_FAILED':
      this.showMessage('Analysis failed. Please try again later.');
      break;
    default:
      this.showMessage('An unexpected error occurred.');
  }
}
```

---

## Usage Examples

### Basic Application Flow

```typescript
// 1. Component initialization
export class AppComponent implements OnInit {
  selectedSong: Song | null = null;
  moodResult: MoodResult | null = null;

  constructor(private moodService: MoodService) {}

  // 2. Song selection handling
  onSongSelected(song: Song): void {
    this.selectedSong = song;
    
    // 3. Trigger mood analysis
    this.moodService.analyzeMood(song).subscribe({
      next: (result) => {
        this.moodResult = result;
        console.log(`Mood detected: ${result.type} (${Math.round(result.analysis.profile.confidence * 100)}% confidence)`);
      },
      error: (error) => {
        console.error('Analysis failed:', error);
        this.moodResult = null;
      }
    });
  }
}
```

### Advanced Service Usage

```typescript
// Complex mood analysis with state tracking
export class AdvancedMoodComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  analysisState$ = this.moodService.getAnalysisState$();
  availableMoods$ = this.moodService.getAllMoodTypes$();
  
  ngOnInit() {
    // Monitor analysis state changes
    this.analysisState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.isLoading) {
          this.showProgressIndicator();
        } else if (state.error) {
          this.handleAnalysisError(state.error);
        } else if (state.result) {
          this.displayDetailedResults(state.result);
          this.updateHistoryLog(state.result);
        }
      });
      
    // Load mood configurations for reference
    this.availableMoods$
      .pipe(
        switchMap(moods => 
          combineLatest(
            moods.map(mood => 
              this.moodService.getMoodConfiguration$(mood)
            )
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(configurations => {
        this.buildMoodReference(configurations);
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Theme Integration

```typescript
// Theme-aware component
export class ThemedComponent implements OnInit {
  isDarkTheme$ = this.themeService.currentTheme$.pipe(
    map(theme => theme === 'dark')
  );
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    this.isDarkTheme$.subscribe(isDark => {
      this.updateChartColors(isDark);
      this.adjustAnimations(isDark);
    });
  }
  
  // Manual theme control
  switchToOptimalTheme(moodResult: MoodResult) {
    const darkMoods: MoodType[] = ['melancholic', 'anxious', 'contemplative'];
    const shouldUseDarkTheme = darkMoods.includes(moodResult.type);
    
    const targetTheme = shouldUseDarkTheme ? 'dark' : 'light';
    this.themeService.setTheme(targetTheme);
  }
}
```

---

This API documentation provides comprehensive guidance for developers working with the Beatles Mood Analyzer application. All services follow reactive programming patterns and provide type-safe interfaces for reliable application development.
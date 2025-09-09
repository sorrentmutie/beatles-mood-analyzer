# Technical Architecture Documentation

## Overview

The Beatles Mood Analyzer is built using Angular 19 with a modern, scalable architecture that emphasizes separation of concerns, maintainability, and testability. The application follows reactive programming patterns and implements a sophisticated mood analysis engine based on psychometric principles.

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ App         │  │ Song        │  │ Mood Display        │  │
│  │ Component   │  │ Selector    │  │ Component           │  │
│  │             │  │ Component   │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │          Theme Toggle Component                          │  │
│  └─────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Mood        │  │ Song        │  │ Theme               │  │
│  │ Service     │  │ Service     │  │ Service             │  │
│  │             │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Model Layer                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐  │
│  │               Song Models & Interfaces                  │  │
│  │  • Song • MoodResult • PsychologicalProfile           │  │
│  │  • MoodAnalysis • AnalysisState • PsychometricFactors │  │
│  └─────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Angular     │  │ RxJS        │  │ Local Storage       │  │
│  │ Core        │  │ Reactive    │  │ Browser APIs        │  │
│  │             │  │ Extensions  │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy

```
AppComponent (Root)
├── ThemeToggleComponent
├── SongSelectorComponent
└── MoodDisplayComponent
```

### Component Responsibilities

#### AppComponent (`app.component.ts`)
- **Role**: Root orchestrator and state coordinator
- **Responsibilities**:
  - Manages global application state
  - Coordinates communication between child components
  - Handles song selection events
  - Maintains selected song and mood result state
- **Dependencies**: MoodService
- **Template**: Provides layout structure and component composition

#### SongSelectorComponent (`song-selector.component.ts`)
- **Role**: Song selection interface
- **Responsibilities**:
  - Displays available Beatles songs
  - Handles user song selection
  - Emits songSelected events to parent
  - Manages selection state and UI feedback
- **Dependencies**: SongService
- **Events**: `@Output() songSelected: EventEmitter<Song>`

#### MoodDisplayComponent (`mood-display.component.ts`)
- **Role**: Mood analysis visualization
- **Responsibilities**:
  - Displays mood analysis results
  - Shows psychological insights and recommendations
  - Handles loading states during analysis
  - Provides error handling and user feedback
- **Inputs**: 
  - `@Input() selectedSong: Song | null`
  - `@Input() moodResult: MoodResult | null`

#### ThemeToggleComponent (`theme-toggle.component.ts`)
- **Role**: Theme management interface
- **Responsibilities**:
  - Provides theme switching controls
  - Displays current theme state
  - Handles theme toggle interactions
- **Dependencies**: ThemeService

## Service Architecture

### Service Layer Design Principles

1. **Single Responsibility**: Each service handles one domain
2. **Dependency Injection**: Services are provided at root level
3. **Reactive Programming**: RxJS observables for async operations
4. **State Management**: BehaviorSubjects for state tracking
5. **Error Handling**: Comprehensive error handling strategies

### MoodService (`mood.service.ts`)

The core mood analysis engine implementing sophisticated psychological algorithms.

#### Key Features

```typescript
interface MoodService {
  // Public API
  analyzeMood(song: Song): Observable<MoodResult>
  getAnalysisState$(): Observable<AnalysisState>
  getAllMoodTypes$(): Observable<readonly MoodType[]>
  getMoodConfiguration$(moodType: MoodType): Observable<MoodResult>
  
  // Internal analysis pipeline
  private performDeepAnalysis(song: Song): Observable<MoodAnalysis>
  private analyzeLyricalContent(song: Song): Observable<PsychometricFactors>
  private analyzeMusicalFeatures(song: Song): Observable<PsychometricFactors>
  private analyzeHistoricalContext(song: Song): Observable<number>
  private computePsychologicalProfile(song: Song): Observable<PsychologicalProfile>
}
```

#### Analysis Pipeline

```
Song Input
    ↓
Song Validation
    ↓
Parallel Analysis:
├── Lyrical Content Analysis
├── Musical Feature Analysis
├── Historical Context Analysis
└── Psychological Profiling
    ↓
Analysis Synthesis
    ↓
Mood Result Generation
    ↓
State Update & Response
```

#### Analysis Weights Configuration

```typescript
private readonly analysisWeights: AnalysisWeights = {
  tempo: 0.25,              // Musical rhythm impact
  key: 0.20,                // Harmonic emotional influence  
  lyricalContent: 0.30,     // Semantic emotional content
  historicalContext: 0.15,  // Era-based psychological factors
  musicalComplexity: 0.10   // Structural complexity impact
};
```

### SongService (`song.service.ts`)

Manages the Beatles song database and provides song data access.

#### Features
- Static song database with comprehensive metadata
- Song retrieval by ID
- Full song collection access
- Type-safe song operations

#### Song Database Schema

```typescript
interface Song {
  readonly id: number;           // Unique identifier
  readonly title: string;        // Song title
  readonly album: string;        // Album name
  readonly year?: number;        // Release year
  readonly duration?: number;    // Song length in seconds
  readonly tempo?: 'slow' | 'medium' | 'fast';
  readonly key?: string;         // Musical key
  readonly genre?: string;       // Musical genre
  readonly moodCategory?: string; // Primary mood classification
}
```

### ThemeService (`theme.service.ts`)

Manages application theming with persistence and system integration.

#### Features

```typescript
interface ThemeService {
  currentTheme$: Observable<Theme>     // Theme state stream
  currentTheme: Theme                  // Current theme getter
  toggleTheme(): void                  // Theme switching
  setTheme(theme: Theme): void        // Direct theme setting
}
```

#### Theme Detection Strategy

1. **Local Storage**: Check for saved user preference
2. **System Preference**: Use `prefers-color-scheme` media query
3. **Default Fallback**: Light theme as default

#### Theme Application

```typescript
private applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
}
```

## Data Models

### Core Interfaces

#### MoodType Union Type
```typescript
type MoodType = 
  | 'euphoric' | 'melancholic' | 'energetic' | 'contemplative' 
  | 'nostalgic' | 'rebellious' | 'romantic' | 'anxious';
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
  readonly profile: PsychologicalProfile;
  readonly insights: readonly string[];      // Psychological insights
  readonly recommendations: readonly string[]; // Behavioral recommendations
  readonly timestamp: Date;                  // Analysis timestamp
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

## Reactive Programming Patterns

### Observable Streams

The application leverages RxJS for reactive data flow:

```typescript
// Mood analysis stream
analyzeMood(song: Song): Observable<MoodResult> {
  return this.validateSong(song).pipe(
    switchMap(() => this.performDeepAnalysis(song)),
    map(analysis => this.generateMoodResult(analysis)),
    tap(result => this.updateAnalysisState({ result })),
    catchError(error => this.handleAnalysisError(error))
  );
}

// Theme state management
get currentTheme$(): Observable<Theme> {
  return this.themeSubject.asObservable();
}
```

### Error Handling Strategy

```typescript
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
```

## State Management

### Local Component State
- Managed using component properties
- Suitable for UI-specific state
- Lifecycle tied to component

### Service State
- BehaviorSubjects for shared state
- Observable streams for reactive updates
- Persistent across component lifecycle

### Browser State
- LocalStorage for theme preferences
- Session-based temporary state
- Progressive enhancement approach

## Performance Considerations

### Optimization Strategies

1. **OnPush Change Detection**: Components use OnPush strategy where applicable
2. **Lazy Loading**: Feature modules loaded on demand
3. **Observable Optimization**: Proper unsubscription and memory management
4. **Bundle Optimization**: Tree shaking and code splitting
5. **Caching**: Service-level caching for expensive operations

### Memory Management

```typescript
// Component cleanup pattern
export class ComponentExample implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.handleData(data));
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Testing Architecture

### Testing Strategy

1. **Unit Tests**: Individual component and service testing
2. **Integration Tests**: Component-service interaction testing
3. **E2E Tests**: Full user workflow testing
4. **Accessibility Tests**: WCAG compliance verification

### Test Structure

```
src/
├── app/
│   ├── components/
│   │   └── *.spec.ts          # Component unit tests
│   ├── services/
│   │   └── *.spec.ts          # Service unit tests
│   └── *.spec.ts              # Integration tests
├── e2e/
│   └── *.e2e-spec.ts          # End-to-end tests
└── accessibility.spec.ts       # Accessibility tests
```

## Security Architecture

### Security Measures

1. **Input Sanitization**: Angular's built-in XSS protection
2. **Type Safety**: TypeScript compile-time checks
3. **Content Security Policy**: CSP headers for XSS prevention
4. **Data Validation**: Runtime input validation
5. **Secure Dependencies**: Regular security audits

### Data Privacy

- No personal data collection
- Local storage only for preferences
- No external API communication
- Client-side only processing

## Deployment Architecture

### Build Process

```bash
# Development build
ng build --configuration development

# Production build with optimizations
ng build --configuration production --optimization --build-optimizer
```

### Production Optimizations

- **AOT Compilation**: Ahead-of-time compilation
- **Tree Shaking**: Dead code elimination
- **Minification**: Code compression
- **Gzip Compression**: Server-level compression
- **Service Worker**: Offline capability (future enhancement)

### Environment Configuration

```typescript
// Environment-specific configurations
export const environment = {
  production: boolean;
  apiUrl?: string;
  enableAnalytics?: boolean;
  debugMode?: boolean;
};
```

## Future Architecture Considerations

### Scalability Enhancements

1. **State Management**: NgRx for complex state management
2. **Micro Frontends**: Module federation for large teams
3. **Progressive Web App**: Service worker implementation
4. **Server-Side Rendering**: Angular Universal integration
5. **API Integration**: Backend service integration
6. **Real-time Features**: WebSocket integration
7. **Machine Learning**: TensorFlow.js integration for advanced analysis

### Performance Improvements

1. **Virtual Scrolling**: For large song lists
2. **Image Optimization**: WebP format support
3. **Code Splitting**: Route-based splitting
4. **Preloading Strategies**: Predictive resource loading
5. **CDN Integration**: Asset distribution optimization

---

This architecture provides a solid foundation for a maintainable, scalable, and performant Angular application while maintaining clean separation of concerns and following Angular best practices.
```markdown
# Beatles Mood Analyzer - AI Instructions (MVP)

## Project Overview
**Beatles Mood Analyzer**: Simple web app - select Beatles song → get mood card
**Stack**: Angular 18+ • TypeScript • Basic CSS • Local JSON data
**MVP Goal**: Working prototype in 30 minutes

## Core Features (MVP Only)
- Song selection list (10-12 famous Beatles songs)
- Simple mood analysis (5 mood types: Happy, Sad, Energetic, Peaceful, Nostalgic)
- Mood result card with emoji + description
- Responsive layout (mobile-first)

## Architecture (Keep Simple)
### Frontend (Angular)
- **Structure**: Single feature module
- **Components**: app → song-selector → mood-display
- **Services**: song.service.ts, mood.service.ts
- **Data**: Static JSON array in service
- **Styling**: Basic CSS with Beatles colors (yellow/blue)

### Data Models
```typescript
interface Song {
  id: number;
  title: string;
  album: string;
  moodCategory: 'happy' | 'sad' | 'energetic' | 'peaceful' | 'nostalgic';
}

interface MoodResult {
  type: string;
  emoji: string;
  description: string;
  color: string;
}
```

## Development Guidelines - MVP Focus
- Keep it simple: no Angular Material, no complex state management
- Standard Angular CLI project structure
- Implement only core user flow: select → analyze → show result
- Focus on working functionality over visual polish
- No authentication, no persistence, no advanced features

## AI Enhancement Notes
*The AI may suggest more complex architectures (Material, RxJS, modules).
Acknowledge these suggestions but stick to MVP scope for demo timing.*
```

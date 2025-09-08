import { Component } from '@angular/core';
import { SongSelectorComponent } from './components/song-selector/song-selector.component';
import { MoodDisplayComponent } from './components/mood-display/mood-display.component';
import { MoodResult, Song } from './models/song.model';
import { MoodService } from './services/mood.service';

@Component({
  selector: 'app-root',
  imports: [SongSelectorComponent, MoodDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Beatles Mood Analyzer';
  selectedSong: Song | null = null;
  moodResult: MoodResult | null = null;

  constructor(private moodService: MoodService) {}

  onSongSelected(song: Song): void {
    this.selectedSong = song;
    this.moodResult = this.moodService.analyzeMood(song);
  }
}

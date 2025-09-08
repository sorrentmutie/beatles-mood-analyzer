import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodResult, Song } from '../../models/song.model';

@Component({
  selector: 'app-mood-display',
  imports: [CommonModule],
  templateUrl: './mood-display.component.html',
  styleUrl: './mood-display.component.css'
})
export class MoodDisplayComponent {
  @Input() selectedSong: Song | null = null;
  @Input() moodResult: MoodResult | null = null;
}

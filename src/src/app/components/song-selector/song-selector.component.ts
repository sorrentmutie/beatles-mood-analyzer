import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-selector',
  imports: [CommonModule],
  templateUrl: './song-selector.component.html',
  styleUrl: './song-selector.component.css'
})
export class SongSelectorComponent implements OnInit {
  @Output() songSelected = new EventEmitter<Song>();
  
  songs: Song[] = [];
  selectedSong: Song | null = null;

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.songs = this.songService.getSongs();
  }

  onSongSelect(song: Song): void {
    this.selectedSong = song;
    this.songSelected.emit(song);
  }
}

import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private songs: Song[] = [
    { id: 1, title: 'Here Comes The Sun', album: 'Abbey Road', moodCategory: 'happy' },
    { id: 2, title: 'Yesterday', album: 'Help!', moodCategory: 'sad' },
    { id: 3, title: 'Twist and Shout', album: 'Please Please Me', moodCategory: 'energetic' },
    { id: 4, title: 'Let It Be', album: 'Let It Be', moodCategory: 'peaceful' },
    { id: 5, title: 'In My Life', album: 'Rubber Soul', moodCategory: 'nostalgic' },
    { id: 6, title: 'Hey Jude', album: 'Single', moodCategory: 'happy' },
    { id: 7, title: 'Eleanor Rigby', album: 'Revolver', moodCategory: 'sad' },
    { id: 8, title: 'Come Together', album: 'Abbey Road', moodCategory: 'energetic' },
    { id: 9, title: 'The Long and Winding Road', album: 'Let It Be', moodCategory: 'nostalgic' },
    { id: 10, title: 'Blackbird', album: 'The Beatles (White Album)', moodCategory: 'peaceful' },
    { id: 11, title: 'I Want to Hold Your Hand', album: 'Meet The Beatles!', moodCategory: 'happy' },
    { id: 12, title: 'While My Guitar Gently Weeps', album: 'The Beatles (White Album)', moodCategory: 'sad' }
  ];

  getSongs(): Song[] {
    return this.songs;
  }

  getSongById(id: number): Song | undefined {
    return this.songs.find(song => song.id === id);
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SongSelectorComponent } from './song-selector.component';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song.model';

describe('SongSelectorComponent', () => {
  let component: SongSelectorComponent;
  let fixture: ComponentFixture<SongSelectorComponent>;
  let mockSongService: jasmine.SpyObj<SongService>;

  const mockSongs: Song[] = [
    { id: 1, title: 'Hey Jude', album: 'Hey Jude', year: 1968 },
    { id: 2, title: 'Let It Be', album: 'Let It Be', year: 1970 },
    { id: 3, title: 'Yesterday', album: 'Help!', year: 1965 }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SongService', ['getSongs']);

    await TestBed.configureTestingModule({
      imports: [SongSelectorComponent],
      providers: [
        { provide: SongService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SongSelectorComponent);
    component = fixture.componentInstance;
    mockSongService = TestBed.inject(SongService) as jasmine.SpyObj<SongService>;
    
    mockSongService.getSongs.and.returnValue(mockSongs);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load songs on init', () => {
    expect(mockSongService.getSongs).toHaveBeenCalled();
    expect(component.songs).toEqual(mockSongs);
  });

  it('should initialize with no selected song', () => {
    expect(component.selectedSong).toBeNull();
  });

  it('should emit songSelected event when song is selected', () => {
    spyOn(component.songSelected, 'emit');
    const testSong = mockSongs[0];
    
    component.onSongSelect(testSong);
    
    expect(component.selectedSong).toEqual(testSong);
    expect(component.songSelected.emit).toHaveBeenCalledWith(testSong);
  });

  it('should display all songs in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    mockSongs.forEach(song => {
      expect(compiled.textContent).toContain(song.title);
    });
  });
});
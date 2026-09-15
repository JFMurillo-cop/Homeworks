import { Component, OnInit } from '@angular/core';
import { LinkedList } from '../../models/linked-list';

interface Song {
  title: string;
  artist: string;
}

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  private playlist = new LinkedList<Song>();

  currentSong: Song | null = null;
  items: { value: Song; isCurrent: boolean }[] = [];
  canGoNext = false;
  finished = false;

  ngOnInit(): void {
    // Datos simulados (mocked data)
    const mockedSongs: Song[] = [
      { title: 'Bohemian Rhapsody', artist: 'Queen' },
      { title: 'Blinding Lights', artist: 'The Weeknd' },
      { title: 'Ojos Así', artist: 'Shakira' },
      { title: 'Billie Jean', artist: 'Michael Jackson' },
      { title: 'La Bilirrubina', artist: 'Juan Luis Guerra' }
    ];

    mockedSongs.forEach(song => this.playlist.append(song));
    this.refresh();
  }

  playNext(): void {
    const next = this.playlist.next();
    if (next) {
      this.refresh();
    } else {
      this.finished = true;
    }
  }

  restart(): void {
    this.playlist.reset();
    this.finished = false;
    this.refresh();
  }

  private refresh(): void {
    this.currentSong = this.playlist.getCurrent();
    this.items = this.playlist.toArray();
    this.canGoNext = this.playlist.hasNext();
  }
}

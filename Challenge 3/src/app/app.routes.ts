import { Routes } from '@angular/router';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { BrowserHistoryComponent } from './pages/browser-history/browser-history.component';

export const routes: Routes = [
  { path: '', redirectTo: 'playlist', pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent },
  { path: 'historial', component: BrowserHistoryComponent }
];

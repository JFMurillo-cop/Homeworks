import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PageOneComponent } from './pages/page-one/page-one.component';
import { PageTwoComponent } from './pages/page-two/page-two.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'page-one', component: PageOneComponent, canActivate: [authGuard] },
  { path: 'page-two', component: PageTwoComponent, canActivate: [authGuard] }
];

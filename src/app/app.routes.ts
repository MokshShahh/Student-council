import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { AdminComponent } from './admin/admin.component';
import { EventFormComponent } from './event-form/event-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommitteeComponent } from './committee/committee.component';
import { StatusComponent } from './status/status.component';
import { NewsComponent } from './news/news.component';
import { adminGuard, committeeGuard } from './auth.guard';
import { CommitteeDashboardComponent } from './committee/dashboard.component';
import { CommitteeProfileSetupComponent } from './committee/profile-setup.component';

export const routes: Routes = [

  // DEFAULT HOME
  { path: '', component: HomeComponent },

  // MAIN ROUTES
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },

  { path: 'events', component: EventsComponent },
  { path: 'event-form', component: EventFormComponent, canActivate: [committeeGuard] },
  { path: 'committee', component: CommitteeComponent },
  { path: 'committee/dashboard', component: CommitteeDashboardComponent, canActivate: [committeeGuard] },
  { path: 'committee/profile-setup', component: CommitteeProfileSetupComponent, canActivate: [committeeGuard] },
  { path: 'status', component: StatusComponent },
  { path: 'news', component: NewsComponent },

  // AUTH
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔥 ADD THIS (VERY IMPORTANT)
  { path: '**', redirectTo: '' }  // fallback route
];
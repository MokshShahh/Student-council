import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EventsComponent } from './events/events.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard, committeeGuard } from './auth.guard';
import { CommitteeDashboardComponent } from './committee/dashboard.component';
import { CommitteeProfileSetupComponent } from './committee/profile-setup.component';
import { CommitteePublicProfileComponent } from './committee/public-profile.component';

export const routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events', component: EventsComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'committee/dashboard', component: CommitteeDashboardComponent, canActivate: [committeeGuard] },
  { path: 'committee/profile-setup', component: CommitteeProfileSetupComponent, canActivate: [committeeGuard] },
  { path: 'committee/:id', component: CommitteePublicProfileComponent }
];

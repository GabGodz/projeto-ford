import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { HomeComponent } from './home.component';
import { DashboardAdminComponent } from './dashboard-admin.component';
import { DashboardUserComponent } from './dashboard-user.component';
import { FirebaseSetupComponent } from './firebase-setup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'dashboard-user', component: DashboardUserComponent },
  { path: 'firebase-setup', component: FirebaseSetupComponent },
  { path: '**', redirectTo: '' }
];

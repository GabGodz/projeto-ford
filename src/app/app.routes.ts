import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { UserDashboardComponent } from './components/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { ConfigAdminComponent } from './components/config-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'config-admin',
    component: ConfigAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

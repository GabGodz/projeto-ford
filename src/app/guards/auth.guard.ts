import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        // Verifica se é rota de admin
        if (route.data?.['expectedRole'] === 'admin' && user.role !== 'admin') {
          this.router.navigate(['/user-dashboard']);
          return false;
        }

        // Verifica se é rota de usuário
        if (route.data?.['expectedRole'] === 'user' && user.role !== 'user') {
          this.router.navigate(['/admin-dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}
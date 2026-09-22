import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuth = await authService.isAuthenticated();

  if (isAuth) {
    return true;
  }

  // If not authenticated, redirect to login page
  return router.createUrlTree(['/login']);
};

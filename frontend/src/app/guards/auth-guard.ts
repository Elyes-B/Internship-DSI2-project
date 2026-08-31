import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

//the main purpose of this function is to check if the user is authenticated before allowing him to access a route
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in
  if (authService.isLoggedIn()) {
    return true;
  }

  return false;
};

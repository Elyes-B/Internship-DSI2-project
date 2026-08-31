import { AuthService } from './../services/auth';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
const authservice = inject(AuthService);
const router = inject(Router);

const expectedRoutes = route.data['roles']||[];
return authservice.hasRole(expectedRoutes);

};

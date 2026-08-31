import { AuthService } from './../services/auth';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

//routes has 2 guards, the first being auth guards which checks if the user is authenticated, and the second is the role guard which checks if the user has the necessary roles
export const roleGuard: CanActivateFn = (route, state) => {
const authservice = inject(AuthService);
const router = inject(Router);

const expectedRoutes = route.data['roles']||[]; // takes the role from the route  in our case its admin and superadmin
return authservice.hasRole(expectedRoutes); // uses the role checker method we set up in the auth service

};

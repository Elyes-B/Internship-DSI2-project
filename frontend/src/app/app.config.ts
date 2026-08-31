import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt-interceptor';

export function initializeKeycloak(authService: AuthService): () => Promise<boolean> {
  return () => authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // i also added an interceptor for attaching the authenticated user token(useful for user logs section)
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      // keycloak intalizes when the frontend boots
      useFactory: initializeKeycloak,
      deps: [AuthService],
      multi: true
    }
  ]
};

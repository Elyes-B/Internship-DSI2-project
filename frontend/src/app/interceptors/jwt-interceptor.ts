import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  // to know where and who the request is coming from we attach the user token to the every request so the backend can fetch it
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `${token}` //user token from keycloak
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};

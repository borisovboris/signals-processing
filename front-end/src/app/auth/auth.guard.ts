import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from './token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getAuthToken();

  if (token !== null && token !== undefined && token !== '') {
    return true;
  }

  router.navigateByUrl('login');
  return false;
};

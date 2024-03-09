import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getAuthToken(): string | null {
    return window.localStorage.getItem('auth_token');
  }

  setAuthToken(token: string): void {
    window.localStorage.setItem('auth_token', token);
  }

  deleteAuthToken() {
    window.localStorage.removeItem('auth_token');
  }
}

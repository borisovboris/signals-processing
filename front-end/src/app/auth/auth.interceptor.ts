import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getAuthToken();

    if (token !== null) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return this.handleResponseError(next.handle(authReq));
    }

    return this.handleResponseError(next.handle(req));
  }

  handleError(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.router.navigateByUrl('/login');
    }
    
    return throwError(() => err);
  }

  handleResponseError(res: Observable<HttpEvent<any>>) {
    return res.pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          this.handleError(err);
        }

        return throwError(() => err);
      })
    );
  }
}

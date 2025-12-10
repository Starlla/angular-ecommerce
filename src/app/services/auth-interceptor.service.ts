import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {
    console.log('AuthInterceptorService constructor called!');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptorService intercept method called!');
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    console.log('Interceptor checking URL:', request.urlWithParams);

    // Handle both orders and checkout endpoints
    if (request.urlWithParams.includes('http://localhost:8080/api/orders') ||
      request.urlWithParams.includes('http://localhost:8080/api/checkout/purchase')) {
      console.log('Secured endpoint matched! Adding Bearer token...');
      console.log('URL matched! Adding Bearer token...');
      try {
        const token = await lastValueFrom(this.auth.getAccessTokenSilently());
        console.log('Access Token: ', token);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    } else {
      console.log('URL did not match secured endpoints');
    }

    return await lastValueFrom(next.handle(request));
  }
}

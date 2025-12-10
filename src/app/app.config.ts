import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAuth0, AuthHttpInterceptor } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { auth0Config } from './auth0-ssr.config';
import myAppConfig from './my-app-config';
import { AuthInterceptorService } from './services/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
    importProvidersFrom(NgbModule),
    // Auth0 configuration equivalent to AuthModule.forRoot()
    provideAuth0(auth0Config),
    // HTTP Interceptors equivalent to providers array in NgModule
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ]
};

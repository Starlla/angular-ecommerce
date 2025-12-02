import { AuthConfig } from '@auth0/auth0-angular';
import config from './my-app-config';

// Mock location object for SSR
const mockLocation = {
  origin: '',
  href: '',
  protocol: 'https:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/',
  search: '',
  hash: ''
};

// Polyfill location for SSR
if (typeof window === 'undefined') {
  (global as any).location = mockLocation;
}

export const auth0Config: AuthConfig = {
  domain: config.auth.domain,
  clientId: config.auth.clientId,
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' ?
      config.auth.authorizationParams.redirect_uri :
      'http://localhost:4200',
    audience: config.auth.authorizationParams.audience,
  },
  httpInterceptor: {
    allowedList: config.httpInterceptor.allowedList,
  },
  cacheLocation: typeof window !== 'undefined' ? 'localstorage' : 'memory',
  skipRedirectCallback: typeof window === 'undefined',
  useRefreshTokens: typeof window !== 'undefined',
};
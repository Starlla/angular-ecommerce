import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  profileJson: string | undefined;
  userEmail: string | undefined;
  storage: Storage | undefined;
  private isBrowser = typeof window !== 'undefined';

  constructor(@Optional() private auth: AuthService, @Inject(DOCUMENT) private doc: Document) {
    if (this.isBrowser) {
      this.storage = sessionStorage;
    }
  }

  ngOnInit(): void {
    if (this.isBrowser && this.auth) {
      this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
        this.isAuthenticated = authenticated;
        console.log('User is authenticated: ', this.isAuthenticated);
      });

      this.auth.user$.subscribe((user) => {
        this.userEmail = user?.email;
        if (this.storage) {
          this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
          console.log('User ID: ', this.userEmail);
        }
      });
    }
  }

  getUserDetails(): string | null {
    if (this.isAuthenticated && this.isBrowser && this.storage) {
      try {
        const storedEmail = this.storage.getItem('userEmail');
        if (storedEmail) {
          return JSON.parse(storedEmail);
        }
      } catch (error) {
        console.error('Error retrieving user email from session storage:', error);
      }
    }
    return null;
  }

  login() {
    if (this.isBrowser && this.auth) {
      this.auth.loginWithRedirect();
    }
  }

  logout(): void {
    if (this.isBrowser && this.auth) {
      this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
    }
  }
}

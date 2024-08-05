import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    console.log('AuthGuard: Token:', token);
    const isLoggedIn = !!token;
    if (!isLoggedIn) {
      console.log('AuthGuard: Not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
    console.log('AuthGuard: Logged in');
    return true;
  }
}

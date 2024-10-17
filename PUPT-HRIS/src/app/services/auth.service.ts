import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode'; 
import { CampusContextService } from './campus-context.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private injector: Injector) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    // Use injector to get CampusContextService only when needed
    const campusContextService = this.injector.get('CampusContextService');
    campusContextService.clearCampusId();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserId(): number | null {
    const token = this.getToken();
    if (token) {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.userId;
    }
    return null;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { newPassword });
  } 

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID is missing from token');
    }
    return this.http.post(`${this.apiUrl}/change-password`, { userId, currentPassword, newPassword });
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || [];
    }
    return [];
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('admin');
  }

  isSuperAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('superadmin');
  }

  isFaculty(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('faculty');
  }

  // Example of role checking
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  // Add this new method
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}

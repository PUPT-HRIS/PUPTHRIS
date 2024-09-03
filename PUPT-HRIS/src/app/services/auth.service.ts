import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
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
}

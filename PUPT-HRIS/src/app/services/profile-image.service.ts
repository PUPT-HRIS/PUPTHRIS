import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  private apiUrl = `${environment.apiBaseUrl}/profile-image`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  uploadProfileImage(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('profileImage', file);

    return this.http.post<any>(`${this.apiUrl}/upload`, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getProfileImage(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

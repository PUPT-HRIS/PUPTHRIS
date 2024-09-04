import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserSignature } from '../model/userSignature.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSignatureService {

  private apiUrl = `${environment.apiBaseUrl}/user-signature`;

  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  addUserSignature(formData: FormData): Observable<UserSignature> {
    return this.http.post<UserSignature>(this.apiUrl, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateUserSignature(signatureId: number, formData: FormData): Observable<UserSignature> {
    return this.http.put<UserSignature>(`${this.apiUrl}/${signatureId}`, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUserSignatureById(userId: number): Observable<UserSignature> {
    return this.http.get<UserSignature>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  

  // Handle errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

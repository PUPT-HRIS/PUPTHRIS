import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Education } from '../model/education.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiUrl = `${environment.apiBaseUrl}/education`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEducation(id: number): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getEducationByUser(userId: number): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/add`, education, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateEducation(id: number, education: Education): Observable<Education> {
    return this.http.patch<Education>(`${this.apiUrl}/update/${id}`, education, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEducation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

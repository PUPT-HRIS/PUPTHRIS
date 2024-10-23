import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LearningDevelopment } from '../model/learning-development.model';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private apiUrl = `${environment.apiBaseUrl}/learningdevelopment`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getLearningDevelopments(userId: number): Observable<LearningDevelopment[]> {
    console.log('Service: Fetching learning developments for user ID:', userId);
    return this.http.get<LearningDevelopment[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Raw response from server:', response)),
        catchError(this.handleError)
      );
  }

  addLearningDevelopment(data: LearningDevelopment): Observable<LearningDevelopment> {
    return this.http.post<LearningDevelopment>(`${this.apiUrl}/add`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLearningDevelopment(id: number, data: LearningDevelopment): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLearningDevelopment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

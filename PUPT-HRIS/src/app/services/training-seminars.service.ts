import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TrainingSeminar } from '../model/training-seminars.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingSeminarsService {
  private apiUrl = `${environment.apiBaseUrl}/trainings`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTrainings(userId: number): Observable<TrainingSeminar[]> {
    return this.http.get<TrainingSeminar[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addTraining(training: FormData): Observable<TrainingSeminar> {
    return this.http.post<TrainingSeminar>(`${this.apiUrl}/add`, training, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateTraining(id: number, training: FormData): Observable<TrainingSeminar> {
    return this.http.patch<TrainingSeminar>(`${this.apiUrl}/update/${id}`, training, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTraining(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

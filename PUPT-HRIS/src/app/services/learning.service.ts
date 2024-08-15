import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LearningDevelopment } from '../model/learning-development.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private apiUrl = `${environment.apiBaseUrl}/learningdevelopment`;

  constructor(private http: HttpClient) { }

  getLearningDevelopments(userId: number): Observable<LearningDevelopment[]> {
    return this.http.get<LearningDevelopment[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addLearningDevelopment(data: LearningDevelopment): Observable<LearningDevelopment> {
    return this.http.post<LearningDevelopment>(`${this.apiUrl}/add`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLearningDevelopment(id: number, data: LearningDevelopment): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLearningDevelopment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

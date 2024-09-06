import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AchievementAward } from '../model/achievement-awards.model';

@Injectable({
  providedIn: 'root'
})
export class AchievementAwardService {
  private apiUrl = `${environment.apiBaseUrl}/achievement-awards`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addAchievement(achievement: FormData): Observable<AchievementAward> {
    return this.http.post<AchievementAward>(`${this.apiUrl}/add`, achievement, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateAchievement(id: number, achievement: FormData): Observable<AchievementAward> {
    return this.http.patch<AchievementAward>(`${this.apiUrl}/${id}`, achievement, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAchievementsByUserId(userId: number): Observable<AchievementAward[]> {
    return this.http.get<AchievementAward[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }  

  deleteAchievement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  private handleError(error: any): Observable<never> {
    console.error('Server Error:', error);
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    return throwError(errorMessage);
  }
}

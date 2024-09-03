import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AchievementAward } from '../model/achievement-awards.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AchievementAwardService {
  private apiUrl = `${environment.apiBaseUrl}/achievement-awards`;

  constructor(private http: HttpClient) { }

  private getHeaders(isFormData: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  getAchievementAwards(userId: number): Observable<AchievementAward[]> {
    return this.http.get<AchievementAward[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  addAchievementAward(data: FormData | AchievementAward): Observable<AchievementAward> {
    return this.http.post<AchievementAward>(`${this.apiUrl}/add`, data, { headers: this.getHeaders(data instanceof FormData) })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAchievementAward(id: number, data: FormData | AchievementAward): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders(data instanceof FormData) })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAchievementAward(id: number): Observable<any> {
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

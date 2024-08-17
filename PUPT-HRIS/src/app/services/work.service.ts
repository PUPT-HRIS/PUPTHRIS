import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkExperience } from '../model/work.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  private apiUrl = `${environment.apiBaseUrl}/workexperience`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getWorkExperiences(userID: number): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(`${this.apiUrl}/user/${userID}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  addWorkExperience(data: WorkExperience): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(`${this.apiUrl}/add`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateWorkExperience(id: number, data: WorkExperience): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteWorkExperience(id: number): Observable<any> {
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

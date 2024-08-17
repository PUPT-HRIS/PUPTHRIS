import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NonAcademic } from '../model/nonacademic.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NonAcademicService {
  private apiUrl = `${environment.apiBaseUrl}/nonacademic`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
  }

  addNonAcademic(distinction: NonAcademic): Observable<NonAcademic> {
    return this.http.post<NonAcademic>(`${this.apiUrl}/add`, distinction, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateNonAcademic(id: number, distinction: NonAcademic): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, distinction, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getNonAcademics(userId: number): Observable<NonAcademic[]> {
    return this.http.get<NonAcademic[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  deleteNonAcademic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

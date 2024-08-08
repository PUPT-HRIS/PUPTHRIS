import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getEducation(id: number): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getEducationByEmployee(employeeId: number): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/employee/${employeeId}`).pipe(
      catchError(this.handleError)
    );
  }

  addEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/add`, education).pipe(
      catchError(this.handleError)
    );
  }

  updateEducation(id: number, education: Education): Observable<Education> {
    return this.http.patch<Education>(`${this.apiUrl}/update/${id}`, education).pipe(
      catchError(this.handleError)
    );
  }

  deleteEducation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

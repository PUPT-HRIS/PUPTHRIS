import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getWorkExperiences(employeeId: number): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(`${this.apiUrl}/employee/${employeeId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addWorkExperience(data: WorkExperience): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(`${this.apiUrl}/add`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateWorkExperience(id: number, data: WorkExperience): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteWorkExperience(id: number): Observable<any> {
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

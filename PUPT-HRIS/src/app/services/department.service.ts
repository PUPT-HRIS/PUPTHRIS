import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Department } from '../model/department.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiBaseUrl}/department`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDepartments(campusId: number): Observable<Department[]> {
    console.log('DepartmentService: Fetching departments for campus ID:', campusId);
    return this.http.get<Department[]>(`${this.apiUrl}?campusId=${campusId}`, { headers: this.getHeaders() })
      .pipe(
        tap(departments => console.log('DepartmentService: API response for departments:', departments)),
        catchError(error => {
          console.error('Error in getDepartments:', error);
          return throwError(() => new Error(error.message || 'Server error'));
        })
      );
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/add`, department, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, department, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

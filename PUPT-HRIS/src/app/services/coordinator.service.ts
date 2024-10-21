import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Coordinator, Department } from '../model/coodinatorModel';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {
  private apiUrl = `${environment.apiBaseUrl}/coordinators`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  assignCoordinator(departmentId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign`, { departmentId, userId }, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Assign coordinator response:', response)),
        catchError(this.handleError)
      );
  }

  removeCoordinator(departmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${departmentId}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Remove coordinator response:', response)),
        catchError(error => {
          console.error('Error removing coordinator:', error);
          return throwError(() => new Error('Failed to remove coordinator. Please try again.'));
        })
      );
  }

  getCoordinatorByDepartment(departmentId: number): Observable<Coordinator> {
    return this.http.get<Coordinator>(`${this.apiUrl}/department/${departmentId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllDepartmentsWithCoordinators(campusId?: number): Observable<Department[]> {
    let url = `${this.apiUrl}/departments-with-coordinators`;
    if (campusId) {
      url += `?campusId=${campusId}`;
    }
    console.log('Requesting URL:', url);
    return this.http.get<Department[]>(url, { headers: this.getHeaders() }).pipe(
      tap(departments => console.log('Raw response from backend:', JSON.stringify(departments, null, 2))),
      catchError(this.handleError)
    );
  }

  updateCoordinator(departmentId: number, userId: number): Observable<Coordinator> {
    return this.http.put<Coordinator>(`${this.apiUrl}/update/${departmentId}`, { userId }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}

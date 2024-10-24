import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserDashboardData {
  department: string;
  academicRank: string;
  employmentType: string;
  // Add more properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardData(campusId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard-data`, { params: { campusId: campusId.toString() }, headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getUserDashboardData(userId: number): Observable<UserDashboardData> {
    const headers = this.getHeaders();
    return this.http.get<UserDashboardData>(`${this.apiUrl}/user-dashboard-data/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.message || 'Server error');
  }
}

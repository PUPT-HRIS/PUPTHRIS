import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OfficershipMembership } from '../model/officership-membership.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficershipMembershipService {
  private apiUrl = `${environment.apiBaseUrl}/officership-membership`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getOfficershipMemberships(userId: number): Observable<OfficershipMembership[]> {
    return this.http.get<OfficershipMembership[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  addOfficershipMembership(data: OfficershipMembership): Observable<OfficershipMembership> {
    return this.http.post<OfficershipMembership>(`${this.apiUrl}/add`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateOfficershipMembership(id: number, data: OfficershipMembership): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteOfficershipMembership(id: number): Observable<any> {
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

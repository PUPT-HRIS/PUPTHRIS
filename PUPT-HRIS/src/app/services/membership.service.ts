import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Membership } from '../model/membership.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = `${environment.apiBaseUrl}/membership`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
  }

  addMembership(membership: Membership): Observable<Membership> {
    return this.http.post<Membership>(`${this.apiUrl}/add`, membership, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateMembership(id: number, membership: Membership): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, membership, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getMemberships(userId: number): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  deleteMembership(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

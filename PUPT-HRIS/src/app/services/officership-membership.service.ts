import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficershipMembershipService {
  private apiUrl = `${environment.apiBaseUrl}/officership-membership`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Add Officership/Membership
  addMembership(membership: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, membership, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update Officership/Membership
  updateMembership(id: number, membership: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update/${id}`, membership, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get all memberships for a user
  getMembershipsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Delete membership
  deleteMembership(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OfficershipMembership } from '../model/officership-membership.model';

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

  addOfficershipMembership(membership: OfficershipMembership): Observable<OfficershipMembership> {
    return this.http.post<OfficershipMembership>(`${this.apiUrl}/add`, membership, { headers: this.getHeaders() });
  }

  updateOfficershipMembership(id: number, updates: Partial<OfficershipMembership>): Observable<OfficershipMembership> {
    return this.http.patch<OfficershipMembership>(`${this.apiUrl}/update/${id}`, updates, { headers: this.getHeaders() });
  }

  getOfficershipMembership(id: number): Observable<OfficershipMembership> {
    return this.http.get<OfficershipMembership>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getOfficershipMembershipsByUserId(userId: number): Observable<OfficershipMembership[]> {
    return this.http.get<OfficershipMembership[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  deleteOfficershipMembership(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}

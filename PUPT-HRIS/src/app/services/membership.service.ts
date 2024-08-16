import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Membership } from '../model/membership.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = `${environment.apiBaseUrl}/membership`;

  constructor(private http: HttpClient) {}

  addMembership(membership: Membership): Observable<Membership> {
    return this.http.post<Membership>(`${this.apiUrl}/add`, membership, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateMembership(id: number, membership: Membership): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, membership, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getMemberships(userId: number): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${this.apiUrl}/user/${userId}`);
  }

  deleteMembership(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}



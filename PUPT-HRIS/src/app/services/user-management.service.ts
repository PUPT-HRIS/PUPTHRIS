import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../model/user.model';
import { Role } from '../model/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiBaseUrl}/user-management`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserDetails(UserID: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${UserID}`, { headers: this.getHeaders() });
  }

  updateEmploymentType(UserID: number, EmploymentType: string): Observable<any> {
    const body = { UserID, EmploymentType };
    return this.http.put(`${this.apiUrl}/employment-type`, body, { headers: this.getHeaders() });
  }

  updateUserRoles(UserID: number, Roles: number[]): Observable<any> {
    const body = { UserID, Roles };
    return this.http.put(`${this.apiUrl}/roles`, body, { headers: this.getHeaders() });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }
}
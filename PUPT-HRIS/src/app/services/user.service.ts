import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token for headers:', token ? 'Present' : 'Not found');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUsers(campusId?: number): Observable<User[]> {
    let url = this.apiUrl;
    if (campusId) {
      url += `?campusId=${campusId}`;
    }
    return this.http.get<User[]>(url, { headers: this.getHeaders() });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }



  getCurrentUserCampus(userId: number): Observable<any> {
    console.log('Fetching current campus for user:', userId);
    return this.http.get<any>(`${this.apiUrl}/${userId}/current-campus`, { headers: this.getHeaders() })
      .pipe(
        tap(campus => console.log('Current campus fetched:', campus)),
        catchError(error => {
          console.error('Error fetching current campus:', error);
          throw error;
        })
      );
  }

  updateUserCampus(userId: number, campusId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/update-campus`, { campusId }, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

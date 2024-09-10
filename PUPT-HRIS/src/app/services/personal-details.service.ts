import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonalDetails } from '../model/personal-details.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalDetailsService {
  private apiUrl = `${environment.apiBaseUrl}/personaldetails`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPersonalDetails(userId: number): Observable<PersonalDetails> {
    console.log(`Fetching personal details for user ${userId}`); // Add this to log when it's called
    return this.http.get<PersonalDetails>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  

  addPersonalDetails(data: PersonalDetails): Observable<PersonalDetails> {
    return this.http.post<PersonalDetails>(`${this.apiUrl}/add`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updatePersonalDetails(id: number, data: PersonalDetails): Observable<PersonalDetails> {
    return this.http.patch<PersonalDetails>(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

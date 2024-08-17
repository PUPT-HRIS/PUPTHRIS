import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ContactDetails } from '../model/contact-details.model';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailsService {
  private apiUrl = `${environment.apiBaseUrl}/contact-details`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getContactDetails(userId: number): Observable<ContactDetails> {
    return this.http.get<ContactDetails>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addContactDetails(details: ContactDetails): Observable<ContactDetails> {
    return this.http.post<ContactDetails>(`${this.apiUrl}/add`, details, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateContactDetails(id: number, details: ContactDetails): Observable<ContactDetails> {
    return this.http.patch<ContactDetails>(`${this.apiUrl}/update/${id}`, details, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

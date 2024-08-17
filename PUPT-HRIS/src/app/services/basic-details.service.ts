import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BasicDetails } from '../model/basic-details.model';

@Injectable({
  providedIn: 'root'
})
export class BasicDetailsService {
  private apiUrl = `${environment.apiBaseUrl}/basic-details`;

  constructor(private http: HttpClient) { }

  getBasicDetails(userId: number): Observable<BasicDetails> {
    const token = localStorage.getItem('Token');
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<BasicDetails>(`${this.apiUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }  

  addBasicDetails(basicDetails: BasicDetails): Observable<BasicDetails> {
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<BasicDetails>(`${this.apiUrl}/add`, basicDetails, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateBasicDetails(id: number, basicDetails: BasicDetails): Observable<BasicDetails> {
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<BasicDetails>(`${this.apiUrl}/update/${id}`, basicDetails, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  // Get Basic Details by UserID
  getBasicDetails(userId: number): Observable<BasicDetails> {
    return this.http.get<BasicDetails>(`${this.apiUrl}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add Basic Details
  addBasicDetails(basicDetails: BasicDetails): Observable<BasicDetails> {
    return this.http.post<BasicDetails>(`${this.apiUrl}/add`, basicDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Update Basic Details by ID
  updateBasicDetails(id: number, basicDetails: BasicDetails): Observable<BasicDetails> {
    return this.http.patch<BasicDetails>(`${this.apiUrl}/update/${id}`, basicDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

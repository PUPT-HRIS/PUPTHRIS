import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CivilServiceEligibility } from '../model/civil-service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CivilServiceService {
  private apiUrl = `${environment.apiBaseUrl}/civilservice`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCivilServiceEligibilities(): Observable<CivilServiceEligibility[]> {
    return this.http.get<CivilServiceEligibility[]>(`${this.apiUrl}/employee`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  addCivilServiceEligibility(data: CivilServiceEligibility): Observable<CivilServiceEligibility> {
    return this.http.post<CivilServiceEligibility>(`${this.apiUrl}/add`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCivilServiceEligibility(id: number, data: CivilServiceEligibility): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCivilServiceEligibility(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CollegeCampus } from '../model/college-campus.model'; // You'll need to create this model
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollegeCampusService {
  private apiUrl = `${environment.apiBaseUrl}/college-campuses`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCollegeCampuses(): Observable<CollegeCampus[]> {
    console.log('Fetching college campuses from:', this.apiUrl);
    return this.http.get<CollegeCampus[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(campuses => console.log('College campuses fetched:', campuses)),
        catchError(this.handleError)
      );
  }

  getCollegeCampusById(id: number): Observable<CollegeCampus> {
    return this.http.get<CollegeCampus>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addCollegeCampus(collegeCampus: CollegeCampus): Observable<CollegeCampus> {
    return this.http.post<CollegeCampus>(this.apiUrl, collegeCampus, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCollegeCampus(id: number, collegeCampus: CollegeCampus): Observable<CollegeCampus> {
    return this.http.put<CollegeCampus>(`${this.apiUrl}/${id}`, collegeCampus, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteCollegeCampus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}

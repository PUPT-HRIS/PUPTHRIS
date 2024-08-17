import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VoluntaryWork } from '../model/voluntary-work.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoluntaryWorkService {
  private apiUrl = `${environment.apiBaseUrl}/voluntarywork`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVoluntaryWorks(userId: number): Observable<VoluntaryWork[]> {
    return this.http.get<VoluntaryWork[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addVoluntaryWork(data: VoluntaryWork): Observable<VoluntaryWork> {
    return this.http.post<VoluntaryWork>(`${this.apiUrl}/add`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateVoluntaryWork(id: number, data: VoluntaryWork): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteVoluntaryWork(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

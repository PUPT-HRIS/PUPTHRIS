import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getVoluntaryWorks(employeeId: number): Observable<VoluntaryWork[]> {
    return this.http.get<VoluntaryWork[]>(`${this.apiUrl}/employee/${employeeId}`)
      .pipe(catchError(this.handleError));
  }

  addVoluntaryWork(data: VoluntaryWork): Observable<VoluntaryWork> {
    return this.http.post<VoluntaryWork>(`${this.apiUrl}/add`, data)
      .pipe(catchError(this.handleError));
  }

  updateVoluntaryWork(id: number, data: VoluntaryWork): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteVoluntaryWork(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

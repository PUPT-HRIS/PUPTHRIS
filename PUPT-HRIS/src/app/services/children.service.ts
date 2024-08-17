import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Children } from '../model/children.model';

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {
  private apiUrl = `${environment.apiBaseUrl}/children`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getChildren(userId: number): Observable<Children[]> {
    return this.http.get<Children[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addChild(child: Children): Observable<Children> {
    return this.http.post<Children>(`${this.apiUrl}/add`, child, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateChild(id: number, child: Children): Observable<Children> {
    return this.http.patch<Children>(`${this.apiUrl}/update/${id}`, child, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteChild(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

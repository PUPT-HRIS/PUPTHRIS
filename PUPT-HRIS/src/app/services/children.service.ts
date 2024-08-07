import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getChildren(employeeId: number): Observable<Children[]> {
    return this.http.get<Children[]>(`${this.apiUrl}/employee/${employeeId}`).pipe(
      catchError(this.handleError)
    );
  }

  addChild(child: Children): Observable<Children> {
    return this.http.post<Children>(`${this.apiUrl}/add`, child).pipe(
      catchError(this.handleError)
    );
  }

  updateChild(id: number, child: Children): Observable<Children> {
    return this.http.patch<Children>(`${this.apiUrl}/update/${id}`, child).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

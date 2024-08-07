import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FamilyBackground } from '../model/family-background.model';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private apiUrl = `${environment.apiBaseUrl}/family`;

  constructor(private http: HttpClient) { }

  getFamilyBackground(employeeId: number): Observable<FamilyBackground> {
    return this.http.get<FamilyBackground>(`${this.apiUrl}/${employeeId}`).pipe(
      catchError(this.handleError)
    );
  }

  addFamilyBackground(familyBackground: FamilyBackground): Observable<FamilyBackground> {
    return this.http.post<FamilyBackground>(`${this.apiUrl}/add`, familyBackground).pipe(
      catchError(this.handleError)
    );
  }

  updateFamilyBackground(id: number, familyBackground: FamilyBackground): Observable<FamilyBackground> {
    return this.http.patch<FamilyBackground>(`${this.apiUrl}/update/${id}`, familyBackground).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CharacterReference } from '../model/character-reference.model';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterReferenceService {

  private apiUrl = `${environment.apiBaseUrl}/character-reference`;

  constructor(private http: HttpClient) { }

  getReferences(userId: number): Observable<CharacterReference[]> {
    const token = localStorage.getItem('Token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CharacterReference[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }  

  addReference(reference: CharacterReference): Observable<CharacterReference> {
    const token = localStorage.getItem('Token');
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<CharacterReference>(`${this.apiUrl}`, reference, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateReference(referenceId: number, reference: CharacterReference): Observable<CharacterReference> {
    const token = localStorage.getItem('Token');
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<CharacterReference>(`${this.apiUrl}/${referenceId}`, reference, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  deleteReference(referenceId: number): Observable<{ message: string }> {
    const token = localStorage.getItem('Token');
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${referenceId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  } 
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonalDetails } from '../model/personal-details.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalDetailsService {
  private apiUrl = `${environment.apiBaseUrl}/personaldetails`;

  constructor(private http: HttpClient) {}

  getPersonalDetails(userId: number): Observable<PersonalDetails> {
    return this.http.get<PersonalDetails>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  addPersonalDetails(data: PersonalDetails): Observable<PersonalDetails> {
    return this.http.post<PersonalDetails>(`${this.apiUrl}/add`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePersonalDetails(id: number, data: PersonalDetails): Observable<PersonalDetails> {
    return this.http.patch<PersonalDetails>(`${this.apiUrl}/update/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdditionalQuestion } from '../model/additional-question.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdditionalQuestionService {
  private apiUrl = `${environment.apiBaseUrl}/additionalquestion`;

  constructor(private http: HttpClient) {}

  getAdditionalQuestion(userId: number): Observable<AdditionalQuestion> {
    return this.http.get<AdditionalQuestion>(`${this.apiUrl}`, { params: { userId } })
      .pipe(
        catchError(this.handleError)
      );
  }

  addOrUpdateAdditionalQuestion(data: AdditionalQuestion): Observable<AdditionalQuestion> {
    return this.http.post<AdditionalQuestion>(`${this.apiUrl}/addOrUpdate`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

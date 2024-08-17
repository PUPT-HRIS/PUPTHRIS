import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpecialSkill } from '../model/specialskills.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialSkillService {
  private apiUrl = `${environment.apiBaseUrl}/specialskills`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
  }

  addSpecialSkill(skill: SpecialSkill): Observable<SpecialSkill> {
    return this.http.post<SpecialSkill>(`${this.apiUrl}/add`, skill, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateSpecialSkill(id: number, skill: SpecialSkill): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, skill, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getSpecialSkills(userId: number): Observable<SpecialSkill[]> {
    return this.http.get<SpecialSkill[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  deleteSpecialSkill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}

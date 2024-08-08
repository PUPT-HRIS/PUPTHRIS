import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NonAcademic } from '../model/nonacademic.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NonAcademicService {
  private apiUrl = `${environment.apiBaseUrl}/nonacademic`;

  constructor(private http: HttpClient) {}

  addNonAcademic(distinction: NonAcademic): Observable<NonAcademic> {
    return this.http.post<NonAcademic>(`${this.apiUrl}/add`, distinction, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateNonAcademic(id: number, distinction: NonAcademic): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, distinction, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getNonAcademics(employeeId: number): Observable<NonAcademic[]> {
    return this.http.get<NonAcademic[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  deleteNonAcademic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}

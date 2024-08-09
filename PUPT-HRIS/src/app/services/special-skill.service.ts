import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpecialSkill } from '../model/specialskills.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialSkillService {
  private apiUrl = `${environment.apiBaseUrl}/specialskills`;

  constructor(private http: HttpClient) {}

  addSpecialSkill(skill: SpecialSkill): Observable<SpecialSkill> {
    return this.http.post<SpecialSkill>(`${this.apiUrl}/add`, skill, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateSpecialSkill(id: number, skill: SpecialSkill): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, skill, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getSpecialSkills(employeeId: number): Observable<SpecialSkill[]> {
    return this.http.get<SpecialSkill[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  deleteSpecialSkill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}

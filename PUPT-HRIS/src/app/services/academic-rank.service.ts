import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcademicRank } from '../model/academicRank.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcademicRankService {
  private apiUrl = `${environment.apiBaseUrl}/academic-ranks`;

  constructor(private http: HttpClient) { }

  addOrUpdateAcademicRank(academicRank: AcademicRank): Observable<{ message: string, academicRank: AcademicRank }> {
    return this.http.post<{ message: string, academicRank: AcademicRank }>(this.apiUrl, academicRank);
  }

  getAcademicRank(userId: number): Observable<AcademicRank | null> {
    return this.http.get<AcademicRank | null>(`${this.apiUrl}/${userId}`);
  }

  removeAcademicRank(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}
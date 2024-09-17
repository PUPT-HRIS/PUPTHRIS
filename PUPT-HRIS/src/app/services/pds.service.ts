import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdsService {
  private apiUrl = `${environment.apiBaseUrl}/pds`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  downloadPDS(): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/download-pds`, {
      headers,
      responseType: 'blob',
    });
  }

  downloadPDSForUser(userId: number): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/download-pds/${userId}`, {
      headers,
      responseType: 'blob',
    });
  }
}

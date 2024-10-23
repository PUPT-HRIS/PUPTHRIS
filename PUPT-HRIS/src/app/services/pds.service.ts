import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { timeout, catchError } from 'rxjs/operators';

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
    }).pipe(
      timeout(30000), // 30 seconds timeout
      catchError(error => {
        console.error('PDS download error:', error);
        return throwError(() => new Error('PDS download failed. Please try again.'));
      })
    );
  }

  downloadPDSForUser(userId: number): Observable<Blob | { message: string }> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/download-pds/${userId}`;
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error instanceof Blob) {
          return new Observable<{ message: string }>(observer => {
            const reader = new FileReader();
            reader.onload = () => {
              const errorMessage = JSON.parse(reader.result as string);
              observer.next({ message: errorMessage.message });
              observer.complete();
            };
            reader.readAsText(error.error);
          });
        }
        return throwError(() => new Error('PDS download failed. Please try again.'));
      })
    );
  }   
}

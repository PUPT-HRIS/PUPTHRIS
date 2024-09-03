import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserSignature } from '../model/userSignature.model';

@Injectable({
  providedIn: 'root'
})
export class UserSignatureService {
  private apiUrl = `${environment.apiBaseUrl}/signatures`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addUserSignature(signature: UserSignature): Observable<UserSignature> {
    const formData = new FormData();
    formData.append('UserID', signature.UserID.toString());
    formData.append('SignatureImage', signature.SignatureImage);
    return this.http.post<UserSignature>(`${this.apiUrl}/add`, formData, { headers: this.getHeaders() });
  }

  updateUserSignature(signatureId: number, signature: UserSignature): Observable<UserSignature> {
    const formData = new FormData();
    formData.append('UserID', signature.UserID.toString());
    if (signature.SignatureImage) {
      formData.append('SignatureImage', signature.SignatureImage);
    }
    return this.http.patch<UserSignature>(`${this.apiUrl}/update/${signatureId}`, formData, { headers: this.getHeaders() });
  }

  getUserSignature(signatureId: number): Observable<UserSignature> {
    return this.http.get<UserSignature>(`${this.apiUrl}/${signatureId}`, { headers: this.getHeaders() });
  }
}

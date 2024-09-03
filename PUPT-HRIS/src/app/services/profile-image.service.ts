import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileImage } from '../model/profile-image.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileImageService {
  private apiUrl = `${environment.apiBaseUrl}/profile-image`;

  constructor(private http: HttpClient) {}

  uploadProfileImage(userID: number, file: File): Observable<ProfileImage> {
    const formData = new FormData();
    formData.append('userID', userID.toString());
    formData.append('profileImage', file);

    return this.http.post<ProfileImage>(`${this.apiUrl}/upload`, formData);
  }

  getProfileImage(userID: number): Observable<ProfileImage> {
    return this.http.get<ProfileImage>(`${this.apiUrl}/user/${userID}`);
  }

  deleteProfileImage(userID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userID}`);
  }
}

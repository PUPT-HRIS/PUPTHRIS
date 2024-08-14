import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterReference } from '../model/character-reference.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterReferenceService {

  private apiUrl = `${environment.apiBaseUrl}/character-reference`;

  constructor(private http: HttpClient) { }

  getReferences(userId: number): Observable<CharacterReference[]> {
    return this.http.get<CharacterReference[]>(`${this.apiUrl}/user/${userId}`);
  }  

  addReference(reference: CharacterReference): Observable<CharacterReference> {
    return this.http.post<CharacterReference>(`${this.apiUrl}`, reference);
  }

  updateReference(referenceId: number, reference: CharacterReference): Observable<CharacterReference> {
    return this.http.put<CharacterReference>(`${this.apiUrl}/${referenceId}`, reference);
  }

  deleteReference(referenceId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${referenceId}`);
  }  
}

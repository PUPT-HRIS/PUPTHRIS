import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CampusContextService {
  private campusIdSubject = new BehaviorSubject<number | null>(null);
  private readonly CAMPUS_ID_KEY = 'selectedCampusId';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.initializeDefaultCampus();
  }

  private initializeDefaultCampus(): void {
    // First, try to get the campus ID from localStorage
    const storedCampusId = localStorage.getItem(this.CAMPUS_ID_KEY);
    if (storedCampusId) {
      this.setCampusId(parseInt(storedCampusId, 10));
      return;
    }

    // If not in localStorage, fetch from the user's default
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken && decodedToken.userId) {
      this.userService.getCurrentUserCampus(decodedToken.userId).subscribe(
        campus => {
          if (campus && campus.CollegeCampusID) {
            this.setCampusId(campus.CollegeCampusID);
          }
        },
        error => console.error('Error fetching user campus:', error)
      );
    } else {
      console.error('No user ID found in token');
    }
  }

  setCampusId(id: number): void {
    console.log('Setting campus ID to:', id);
    localStorage.setItem(this.CAMPUS_ID_KEY, id.toString());
    this.campusIdSubject.next(id);
  }

  getCampusId(): Observable<number | null> {
    return this.campusIdSubject.asObservable();
  }

  getCurrentCampusId(): number | null {
    const storedId = localStorage.getItem(this.CAMPUS_ID_KEY);
    return storedId ? parseInt(storedId, 10) : null;
  }

  clearCampusId(): void {
    localStorage.removeItem(this.CAMPUS_ID_KEY);
    this.campusIdSubject.next(null);
  }

  // New method to update campus without refreshing
  updateCampus(id: number): void {
    this.setCampusId(id);
    // You can add additional logic here if needed
    console.log('Campus updated without refresh:', id);
  }

  // New method to get the user's default campus
  getUserDefaultCampus(): Observable<number | null> {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken && decodedToken.userId) {
      return new Observable(observer => {
        this.userService.getCurrentUserCampus(decodedToken.userId).subscribe(
          campus => {
            if (campus && campus.CollegeCampusID) {
              observer.next(campus.CollegeCampusID);
              observer.complete();
            } else {
              observer.next(null);
              observer.complete();
            }
          },
          error => {
            console.error('Error fetching user default campus:', error);
            observer.error(error);
          }
        );
      });
    } else {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }
}

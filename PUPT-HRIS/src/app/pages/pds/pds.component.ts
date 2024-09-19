import { Component, OnInit } from '@angular/core';
import { PdsService } from '../../services/pds.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-pds',
  templateUrl: './pds.component.html',
  styleUrls: ['./pds.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PdsComponent implements OnInit {
  userId: number | null = null;
  users: User[] = [];
  isLoading: boolean = false;

  // New properties for toast notification
  showToast: boolean = false;
  errorMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'error'; // Default to 'error'

  constructor(
    private pdsService: PdsService, 
    private userService: UserService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
    }

    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error fetching users', error),
    });
  }

  viewPds(): void {
    this.isLoading = true;

    this.pdsService.downloadPDS().subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const pdfWindow = window.open(url);

        this.isLoading = false;
        if (pdfWindow) {
          setTimeout(() => {
            pdfWindow.focus();
            pdfWindow.print();
          }, 1000);
        }
      },
      (error) => {
        console.error('Error downloading personal PDS', error);
        this.isLoading = false;
        this.showToastNotification('Error downloading personal PDS. Please try again.', 'error');
      }
    );
  }

  downloadUserPds(userId: number): void {
    console.log('Requesting PDS for user ID:', userId);
    this.isLoading = true;

    this.pdsService.downloadPDSForUser(userId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);

        this.isLoading = false;
        this.showToastNotification('PDS downloaded successfully.', 'success');
      },
      (error) => {
        console.error('Error downloading user PDS', error);
        this.isLoading = false;

        // Check for missing user information error message
        let errorMessage = 'Error generating PDS. Please try again.';
        if (error.status === 404 && error.error?.message === 'User details not found') {
          errorMessage = 'The information for this user is incomplete.';
        }

        // Display error message in toast notification
        this.showToastNotification(errorMessage, 'error');
      }
    );
  }


  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.errorMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hide toast after 3 seconds
  }
}

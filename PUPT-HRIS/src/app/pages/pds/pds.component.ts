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
  paginatedUsers: User[] = [];
  isLoading: boolean = false;
  canManageEmployees: boolean = false;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

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
      this.canManageEmployees = decodedToken.roles.includes('admin') || decodedToken.roles.includes('superadmin');
    }

    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      error: (error) => console.error('Error fetching users', error),
    });
  }

  // Update paginated users based on the current page
  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
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

  getRoleName(roles: { RoleName: string }[]): string {
    if (roles && roles.length > 0) {
      const relevantRoles = roles.filter(role => 
        role.RoleName.toLowerCase() === 'faculty' || 
        role.RoleName.toLowerCase() === 'staff'
      );
      
      if (relevantRoles.length > 0) {
        return relevantRoles.map(role => 
          role.RoleName.charAt(0).toUpperCase() + role.RoleName.slice(1).toLowerCase()
        ).join(', ');
      }
    }
    return 'N/A';
  }
}

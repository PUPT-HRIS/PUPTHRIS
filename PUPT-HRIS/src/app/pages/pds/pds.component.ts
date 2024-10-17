import { Component, OnInit } from '@angular/core';
import { PdsService } from '../../services/pds.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CampusContextService } from '../../services/campus-context.service';

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
  campusId: number | null = null;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  // Toast notification
  showToast: boolean = false;
  errorMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'error';

  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private pdsService: PdsService, 
    private userService: UserService, 
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private campusContextService: CampusContextService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
      this.canManageEmployees = decodedToken.roles.includes('admin') || decodedToken.roles.includes('superadmin');
    }

    this.campusContextService.getCampusId().subscribe(id => {
      if (id !== null) {
        this.campusId = id;
        this.fetchAllUsers();
      }
    });
  }

  fetchAllUsers(): void {
    if (this.campusId === null) {
      console.error('Campus ID is null');
      return;
    }
    this.userService.getUsers(this.campusId).subscribe({
      next: (users) => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      error: (error) => {
        console.error('Error fetching users', error);
        this.showToastNotification('Failed to load users. Please try again.', 'error');
      },
    });
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

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

  viewPds(): void {
    if (this.userId) {
      this.isLoading = true;
      this.pdsService.downloadPDS().subscribe(
        (pdfBlob: Blob) => {
          const pdfUrl = URL.createObjectURL(pdfBlob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
          this.isLoading = false;
        },
        (error) => {
          console.error('Error generating PDS', error);
          this.isLoading = false;
          this.showToastNotification('Failed to generate PDS. Please try again.', 'error');
        }
      );
    }
  }

  downloadPds(): void {
    this.isLoading = true;
    this.pdsService.downloadPDS().subscribe(
      (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = `PDS_${this.userId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error downloading PDS', error);
        this.isLoading = false;
        this.showToastNotification('Failed to download PDS. Please try again.', 'error');
      }
    );
  }

  downloadUserPds(userId: number): void {
    console.log('Requesting PDS for user ID:', userId);
    this.isLoading = true;
    this.pdsService.downloadPDSForUser(userId).subscribe(
      (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = `PDS_${userId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error downloading PDS for user', error);
        this.isLoading = false;
        this.showToastNotification('Failed to download PDS. Please try again.', 'error');
      }
    );
  }

  getRoleName(roles: any[]): string {
    const relevantRoles = roles.filter(role => 
      role.RoleName.toLowerCase() === 'faculty' || 
      role.RoleName.toLowerCase() === 'staff'
    );
    
    if (relevantRoles.length > 0) {
      return relevantRoles.map(role => 
        role.RoleName.charAt(0).toUpperCase() + role.RoleName.slice(1).toLowerCase()
      ).join(', ');
    }
    return 'N/A';
  }

  showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.errorMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hide toast after 3 seconds
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}

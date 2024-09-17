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
      }
    );
  }

  downloadUserPds(userId: number): void {
    this.isLoading = true;

    this.pdsService.downloadPDSForUser(userId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);

        this.isLoading = false;
      },
      (error) => {
        console.error('Error downloading user PDS', error);
        this.isLoading = false;
      }
    );
  }
}

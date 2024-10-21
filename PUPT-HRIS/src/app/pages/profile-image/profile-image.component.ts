import { Component, OnInit } from '@angular/core';
import { ProfileImageService } from '../../services/profile-image.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProfileImageComponent implements OnInit {
  profileImageUrl: string | null = null;
  userID: number;
  errorMessage: string | null = null;
  isUpdatingImage: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private profileImageService: ProfileImageService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userID = decoded.userId;
    } else {
      this.userID = 0;
    }
  }

  ngOnInit(): void {
    this.loadProfileImage();
  }

  loadProfileImage(): void {
    this.profileImageService.getProfileImage(this.userID).subscribe(
      (profileImage) => {
        if (profileImage) {
          this.profileImageUrl = profileImage.ImagePath + '?t=' + new Date().getTime();
        }
      },
      (error) => {
        console.error('Error loading profile image:', error);
        this.showToastMessage('Error loading profile image', 'error');
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.profileImageService.uploadProfileImage(this.userID, file).subscribe(
        (image) => {
          this.loadProfileImage();
          this.isUpdatingImage = false;
          this.showToastMessage('Profile image updated successfully', 'success');
        },
        (error) => {
          console.error('Error uploading profile image:', error);
          this.showToastMessage('Failed to upload profile image. Please try again.', 'error');
        }
      );
    }
  }

  startUpdatingImage(): void {
    this.isUpdatingImage = true;
  }

  cancelUpdateImage(): void {
    this.isUpdatingImage = false;
    this.errorMessage = null;
  }

  showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

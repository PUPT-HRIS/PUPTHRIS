import { Component, OnInit } from '@angular/core';
import { ProfileImageService } from '../../services/profile-image.service';
import { ProfileImage } from '../../model/profile-image.model';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css'],
  standalone: true,
  imports: [ CommonModule ]
})
export class ProfileImageComponent implements OnInit {
  profileImage$: Observable<ProfileImage | null> = of(null);
  userID: number;
  errorMessage: string | null = null;

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
    this.profileImage$ = this.profileImageService.getProfileImage(this.userID);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.profileImageService.uploadProfileImage(this.userID, file).subscribe(
        (image) => {
          this.loadProfileImage();
        },
        (error) => {
          console.error('Error uploading profile image:', error);
          this.errorMessage = 'Failed to upload profile image. Please try again.';
        }
      );
    }
  }

  deleteProfileImage() {
    this.profileImageService.deleteProfileImage(this.userID).subscribe(
      () => {
        this.loadProfileImage();
      },
      (error) => {
        console.error('Error deleting profile image:', error);
        this.errorMessage = 'Failed to delete profile image. Please try again.';
      }
    );
  }
}

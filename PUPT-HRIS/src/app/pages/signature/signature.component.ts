import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserSignatureService } from '../../services/user-signature.service';
import { UserSignature } from '../../model/userSignature.model';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserSignatureComponent implements OnInit {
  signatureForm: FormGroup;
  signature!: UserSignature;
  userId: number = 0;
  selectedFile: File | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  initialFormValue: any;
  isUpdatingSignature: boolean = false;
  hasUploadedSignature: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userSignatureService: UserSignatureService,
    private authService: AuthService
  ) {
    this.signatureForm = this.fb.group({
      UserID: ['']
    });
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
    }
  }

  ngOnInit(): void {
    this.loadSignature();
  }

  loadSignature(): void {
    if (this.userId) {
      this.userSignatureService.getUserSignatureById(this.userId).subscribe(
        (data) => {
          this.signature = data;
          this.hasUploadedSignature = !!this.signature.SignatureImageURL;
        },
        (error) => {
          this.showToastNotification('Error loading signature.', 'error');
          console.error('Error loading signature:', error);
        }
      );
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size < 100 * 1024) {
      this.selectedFile = file;
    } else {
      this.showToastNotification('File is too large. Please upload a file smaller than 100kb.', 'error');
      this.selectedFile = null;
    }
  }

  onSave(): void {
    if (!this.selectedFile) {
      this.showToastNotification('Please upload a signature before saving.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('UserID', this.userId.toString());
    formData.append('signatureImage', this.selectedFile);

    this.userSignatureService.addUserSignature(formData).subscribe(
      (data) => {
        this.showToastNotification('Signature updated successfully.', 'success');
        this.isUpdatingSignature = false;
        this.loadSignature();
      },
      (error) => {
        this.showToastNotification('Error updating signature.', 'error');
        console.error('Error updating signature:', error);
      }
    );
  }

  onCancelUpdate(): void {
    this.isUpdatingSignature = false;
    this.selectedFile = null;
  }

  startUpdatingSignature(): void {
    this.isUpdatingSignature = true;
  }

  getSignatureImageURL(): string {
    if (this.signature && this.signature.SignatureImageURL) {
      return `${this.signature.SignatureImageURL}?t=${new Date().getTime()}`;
    }
    return '';
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

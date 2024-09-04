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
  userId: number;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  initialFormValue: any;

  constructor(
    private fb: FormBuilder,
    private userSignatureService: UserSignatureService,
    private authService: AuthService
  ) {
    this.signatureForm = this.fb.group({
      UserID: [''],
      SignatureImage: [null]
    });

    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }
  }

  ngOnInit(): void {
    this.loadSignature();
  }

  loadSignature(): void {
    this.userSignatureService.getUserSignature(this.userId).subscribe(
      (data) => {
        this.signature = data;
        this.signatureForm.patchValue({
          UserID: this.signature.UserID,
        });
        this.initialFormValue = this.signatureForm.getRawValue(); // Save initial form value
      },
      (error) => {
        this.showToastNotification('Error loading signature.', 'error');
        console.error('Error loading signature:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size < 100 * 1024) { // Validate file size less than 100kb
      this.signatureForm.patchValue({ SignatureImage: file });
    } else {
      this.showToastNotification('File is too large. Please upload a file smaller than 100kb.', 'error');
      this.signatureForm.patchValue({ SignatureImage: null });
    }
  }

  onSave(): void {
    if (!this.signatureForm.get('SignatureImage')?.value) {
      this.showToastNotification('Please upload a signature before saving.', 'error');
      return;
    }

    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const formData = this.signatureForm.value;
    formData.UserID = this.userId;

    if (this.signature?.SignatureID) {
      this.userSignatureService.updateUserSignature(this.signature.SignatureID, formData).subscribe(
        (data) => {
          this.showToastNotification('Signature updated successfully.', 'success');
          this.loadSignature();
        },
        (error) => {
          this.showToastNotification('Error updating signature.', 'error');
          console.error('Error updating signature:', error);
        }
      );
    } else {
      this.userSignatureService.addUserSignature(formData).subscribe(
        (data) => {
          this.showToastNotification('Signature added successfully.', 'success');
          this.loadSignature();
        },
        (error) => {
          this.showToastNotification('Error adding signature.', 'error');
          console.error('Error adding signature:', error);
        }
      );
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.signatureForm.getRawValue();
    return JSON.stringify(currentFormValue) !== JSON.stringify(this.initialFormValue);
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hide toast after 3 seconds
  }
}

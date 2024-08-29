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
      },
      (error) => {
        console.error('Error loading signature:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.signatureForm.patchValue({ SignatureImage: file });
    }
  }

  onSave(): void {
    const formData = this.signatureForm.value;
    formData.UserID = this.userId;

    if (this.signature?.SignatureID) {
      this.userSignatureService.updateUserSignature(this.signature.SignatureID, formData).subscribe(
        (data) => {
          console.log('Signature updated successfully:', data);
        },
        (error) => {
          console.error('Error updating signature:', error);
        }
      );
    } else {
      this.userSignatureService.addUserSignature(formData).subscribe(
        (data) => {
          console.log('Signature added successfully:', data);
        },
        (error) => {
          console.error('Error adding signature:', error);
        }
      );
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule], // Include RouterModule here
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.forgotPassword(email)
        .subscribe({
          next: (response: any) => {
            console.log('Password reset link sent:', response.message);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Password reset failed', error);
            this.errorMessage = 'Failed to send password reset link. Please try again.';
          }
        });
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Please enter a valid email address.';
    }
  }

  // Method to navigate back to login (if needed)
  backToLogin() {
    this.router.navigate(['/login']);
  }
}

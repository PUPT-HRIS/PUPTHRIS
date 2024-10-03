import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  errorMessage: string | null = null;
  token: string;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });

    this.token = this.route.snapshot.queryParams['token'];
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value !== confirmPassword.value ? { 'mustMatch': true } : null;
  }

  submit() {
    if (this.resetPasswordForm.valid) {
      const { newPassword } = this.resetPasswordForm.value;
      this.authService.resetPassword(this.token, newPassword)
        .subscribe({
          next: (response: any) => {
            console.log('Password reset successful:', response.message);
            this.showToastNotification('Password reset successful. You can now log in with your new password.', 'success');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          },
          error: (error) => {
            console.error('Password reset failed', error);
            this.showToastNotification('Failed to reset password. Please try again.', 'error');
          }
        });
    } else {
      this.showToastNotification('Please ensure the passwords match and meet the requirements.', 'warning');
    }
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

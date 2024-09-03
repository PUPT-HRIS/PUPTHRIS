import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SettingsComponent {
  changePasswordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value !== confirmPassword.value ? { 'mustMatch': true } : null;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          this.successMessage = 'Password changed successfully!';
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to change password. Please try again.';
          this.successMessage = null;
        }
      });
    }
  }
}

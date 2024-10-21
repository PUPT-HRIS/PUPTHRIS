import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  
  images = [
    { src: 'assets/Pylon.svg', alt: 'PUP Pylon' },
    { src: 'assets/loginAsset.svg', alt: 'PUP Taguig Campus' },
    { src: 'assets/SanJuan.svg', alt: 'PUP San Juan Campus' },
    { src: 'assets/Paranaque.svg', alt: 'PUP Paranaque Campus' },
  ];
  currentImageIndex = 0;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Any initialization logic can go here
  }

  hasPreviousImage(): boolean {
    return this.currentImageIndex > 0;
  }

  hasNextImage(): boolean {
    return this.currentImageIndex < this.images.length - 1;
  }

  nextImage() {
    if (this.hasNextImage()) {
      this.currentImageIndex++;
    }
  }

  prevImage() {
    if (this.hasPreviousImage()) {
      this.currentImageIndex--;
    }
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .subscribe((response: any) => {
          localStorage.setItem('token', response.token);
          console.log('Login successful, token:', response.token);
          this.router.navigate(['/dashboard']);
        }, (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password. Please try again.';
        });
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Please fill in both fields correctly.';
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  setCurrentImage(index: number) {
    this.currentImageIndex = index;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
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
  private autoScrollInterval: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.nextImage();
    }, 2000); // 2000ms = 2 seconds
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  hasPreviousImage(): boolean {
    return this.currentImageIndex > 0;
  }

  hasNextImage(): boolean {
    return this.currentImageIndex < this.images.length - 1;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.stopAutoScroll();
    if (this.hasPreviousImage()) {
      this.currentImageIndex--;
    }
    this.startAutoScroll();
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
    this.stopAutoScroll();
    this.currentImageIndex = index;
    this.startAutoScroll();
  }
}

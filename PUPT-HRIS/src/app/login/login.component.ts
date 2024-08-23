import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password)
      .subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        console.log('Login successful, token:', response.token);
        this.router.navigate(['/dashboard']);
      }, (error) => {
        console.error('Login failed', error);
      });
  }
}

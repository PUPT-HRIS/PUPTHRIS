import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userFirstName: string = '';

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded);
  
      const userId = decoded.userId;
  
      if (userId) {
        this.userService.getUserById(userId).subscribe(
          (user) => {
            this.userFirstName = user.FirstName;
          },
          (error) => {
            console.error('Error fetching user data', error);
          }
        );
      } else {
        console.error('userId not found in token');
      }
    }
  }
  
}

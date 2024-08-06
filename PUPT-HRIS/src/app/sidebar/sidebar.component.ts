import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  activeItem: string = '';
  isProfileDropdownOpen: boolean = false;
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.role = decodedToken.role;
    }
  }

  get isProfileActive(): boolean {
    return this.activeItem.startsWith('my-profile') || this.isProfileDropdownOpen;
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) {
      this.activeItem = 'my-profile';
    } else if (this.activeItem === 'my-profile') {
      this.activeItem = '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

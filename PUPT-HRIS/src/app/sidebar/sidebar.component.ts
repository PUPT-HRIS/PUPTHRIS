import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
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
  roles: string[] = [];
  isReportsDropdownOpen: boolean = false;
  isReportsActive: boolean = false;
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveItemBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.roles = decodedToken.roles; // This is now an array of roles
    }

    // Set active item based on the initial route
    this.setActiveItemBasedOnRoute(this.router.url);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  // Sidebar items visibility logic
  get canManageDepartments(): boolean {
    return this.hasRole('superadmin');
  }

  get canManageEmployees(): boolean {
    return this.hasRole('superadmin') || this.hasRole('admin');
  }

  get canAccessProfile(): boolean {
    return this.hasRole('faculty') || this.hasRole('staff') || this.hasRole('admin') || this.hasRole('superadmin');
  }

  get canManageUserManagement(): boolean {
    return this.hasRole('superadmin') || this.hasRole('admin');
  }

  get canPrintPds(): boolean {
    return this.hasRole('faculty') || this.hasRole('staff') || this.hasRole('admin') || this.hasRole('superadmin');
  }

  get isProfileActive(): boolean {
    // This method determines if the profile section should be active or not
    return this.activeItem.startsWith('my-profile') || this.isProfileDropdownOpen;
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) {
      this.activeItem = 'my-profile';
    } else if (this.activeItem.startsWith('my-profile')) {
      this.activeItem = '';
    }
  }

  setActiveItemBasedOnRoute(url: string) {
    if (url.includes('dashboard')) {
      this.activeItem = 'dashboard';
    } else if (url.includes('departments')) {
      this.activeItem = 'department-management';
    } else if (url.includes('user-management')) {
      this.activeItem = 'user-management';
    } else if (url.includes('employees')) {
      this.activeItem = 'employees';
    } else if (url.includes('print-pds')) {
      this.activeItem = 'print-pds';
    } else if (url.includes('new-account')) {
      this.activeItem = 'new-account';
    } else if (url.includes('basic-details')) {
      this.activeItem = 'my-profile-basic-details';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('personal-details')) {
      this.activeItem = 'my-profile-personal-details';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('contact-details')) {
      this.activeItem = 'my-profile-contact-details';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('educational-background')) {
      this.activeItem = 'my-profile-educational-background';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('family-background')) {
      this.activeItem = 'my-profile-family-background';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('children')) {
      this.activeItem = 'my-profile-children';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('civil-service-eligibility')) {
      this.activeItem = 'my-profile-civil-service-eligibility';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('learning-development')) {
      this.activeItem = 'my-profile-learning-development';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('work-experience')) {
      this.activeItem = 'my-profile-work-experience';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('voluntary-works')) {
      this.activeItem = 'my-profile-voluntary-works';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('other-information')) {
      this.activeItem = 'my-profile-other-information';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('trainings-and-seminars')) {
      this.activeItem = 'my-profile-trainings-and-seminars';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('outstanding-achievement')) {
      this.activeItem = 'my-profile-outstanding-achievement';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('officer-membership')) {
      this.activeItem = 'my-profile-officer-membership';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('additional-question')) {
      this.activeItem = 'my-profile-additional-question';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('character-reference')) {
      this.activeItem = 'my-profile-character-reference';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('signature')) {
      this.activeItem = 'my-profile-signature';
      this.isProfileDropdownOpen = true;
    } else if (url.includes('settings')) {
      this.activeItem = 'settings';
    } else if (url.includes('coordinator-management')) {
      this.activeItem = 'coordinator-management';
    } else {
      this.activeItem = '';
    }
  }

  toggleReportsDropdown() {
    this.isReportsDropdownOpen = !this.isReportsDropdownOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get canManageCoordinators(): boolean {
    return this.hasRole('superadmin');
  }
}

import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { User } from '../../model/user.model';
import { Role } from '../../model/role.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  availableRoles: Role[] = [];
  employmentTypes: string[] = ['fulltime', 'parttime', 'temporary', 'designee'];

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchAvailableRoles();
    this.logEmploymentTypes();
  }

  fetchAllUsers(): void {
    this.userManagementService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.users.forEach(user => console.log(user.EmploymentType));
      },
      error: (error) => {
        console.error('Error fetching users', error);
        this.showToastNotification('Error fetching users', 'error');
      },
    });
  }

  fetchAvailableRoles(): void {
    this.userManagementService.getAllRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        console.error('Error fetching roles', error);
        this.showToastNotification('Error fetching roles', 'error');
      },
    });
  }

  logEmploymentTypes(): void {
    console.log('Available Employment Types:', this.employmentTypes);
  }

  isUserRoleSelected(user: User, roleID: number): boolean {
    return user.Roles && user.Roles.some(role => role.RoleID === roleID);
  }

  toggleUserRole(user: User, roleID: number): void {
    if (this.isUserRoleSelected(user, roleID)) {
      user.Roles = user.Roles.filter(role => role.RoleID !== roleID);
    } else {
      const roleToAdd = this.availableRoles.find(role => role.RoleID === roleID);
      if (roleToAdd) {
        user.Roles.push(roleToAdd);
      }
    }
  }

  saveUserDetails(user: User): void {
    this.saveEmploymentType(user);
    this.saveUserRoles(user);
  }

  saveEmploymentType(user: User): void {
    this.userManagementService.updateEmploymentType(user.UserID, user.EmploymentType).subscribe({
      next: (response) => {
        console.log('Employment type updated successfully', response);
        this.showToastNotification('Employment type updated successfully', 'success');
      },
      error: (error) => {
        console.error('Error updating employment type', error);
        this.showToastNotification('Error updating employment type', 'error');
      },
    });
  }

  saveUserRoles(user: User): void {
    const roleIDs = user.Roles.map(role => role.RoleID);
    this.userManagementService.updateUserRoles(user.UserID, roleIDs).subscribe({
      next: (response) => {
        console.log('Roles updated successfully', response);
        this.showToastNotification('Roles updated successfully', 'success');
      },
      error: (error) => {
        console.error('Error updating roles', error);
        this.showToastNotification('Error updating roles', 'error');
      },
    });
  }

  getAdminRoles(): Role[] {
    return this.availableRoles
      .filter(role => 
        role.RoleName.toLowerCase() === 'superadmin' || role.RoleName.toLowerCase() === 'admin'
      )
      .sort((a, b) => {
        if (a.RoleName.toLowerCase() === 'superadmin') return -1;
        if (b.RoleName.toLowerCase() === 'superadmin') return 1;
        return 0;
      });
  }

  getNonAdminRoles(): Role[] {
    return this.availableRoles.filter(role => 
      role.RoleName.toLowerCase() !== 'admin' && role.RoleName.toLowerCase() !== 'superadmin'
    );
  }

  setUserInactive(userID: number): void {
    // Implement set user inactive functionality here
    // After successfully setting the user to inactive:
    // this.showToastNotification('User set to inactive successfully', 'success');
    // If there's an error:
    // this.showToastNotification('Error setting user to inactive', 'error');
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
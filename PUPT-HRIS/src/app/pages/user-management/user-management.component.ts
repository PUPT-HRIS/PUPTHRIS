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
  selectedUser: User | null = null;

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchAvailableRoles();
  }

  fetchAllUsers(): void {
    this.userManagementService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error fetching users', error),
    });
  }

  fetchAvailableRoles(): void {
    this.userManagementService.getAllRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => console.error('Error fetching roles', error),
    });
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
      next: (response) => console.log('Employment type updated successfully', response),
      error: (error) => console.error('Error updating employment type', error),
    });
  }

  saveUserRoles(user: User): void {
    const roleIDs = user.Roles.map(role => role.RoleID);
    this.userManagementService.updateUserRoles(user.UserID, roleIDs).subscribe({
      next: (response) => console.log('Roles updated successfully', response),
      error: (error) => console.error('Error updating roles', error),
    });
  }

  deleteUser(userID: number): void {
  }
}

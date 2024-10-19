import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoordinatorService } from '../../services/coordinator.service';
import { UserManagementService } from '../../services/user-management.service';
import { Department, Coordinator } from '../../model/coodinatorModel';
import { User } from '../../model/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusContextService } from '../../services/campus-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coordinator-management',
  templateUrl: './coordinator-management.component.html',
  styleUrls: ['./coordinator-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CoordinatorManagementComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  facultyUsers: User[] = [];
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  showAssignModal: boolean = false;
  selectedDepartment: Department | null = null;
  campusId: number | null = null;
  private campusSubscription: Subscription | undefined;

  constructor(
    private coordinatorService: CoordinatorService,
    private userManagementService: UserManagementService,
    private campusContextService: CampusContextService
  ) {}

  ngOnInit(): void {
    this.campusSubscription = this.campusContextService.getCampusId().subscribe(
      id => {
        console.log('Received campus ID:', id);
        if (id !== null) {
          this.campusId = id;
          this.loadDepartments();
          this.loadActiveFacultyUsers();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.campusSubscription) {
      this.campusSubscription.unsubscribe();
    }
  }

  loadDepartments(): void {
    this.coordinatorService.getAllDepartmentsWithCoordinators().subscribe({
      next: (departments) => {
        console.log('Fetched departments in component:', departments);
        this.departments = departments;
        this.loadCoordinatorDepartments();
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
        this.showToastNotification('Error fetching departments', 'error');
      }
    });
  }
  
  loadCoordinatorDepartments(): void {
    this.departments.forEach(department => {
      console.log('Processing department:', department);
      if (department.Coordinator?.UserID) {
        this.userManagementService.getUserDetails(department.Coordinator.UserID).subscribe({
          next: (user) => {
            console.log('Fetched user details:', user);
            if (department.Coordinator) {
              department.Coordinator.User = user;
            }
          },
          error: (error) => {
            console.error(`Error fetching user details for coordinator of department ${department.DepartmentID}:`, error);
          }
        });
      }
    });
  }

  loadActiveFacultyUsers(): void {
    if (this.campusId === null) {
      console.error('Campus ID is null');
      return;
    }
    this.userManagementService.getAllUsers(this.campusId).subscribe({
      next: (users) => {
        this.facultyUsers = users.filter(user => 
          user.Roles.some(role => role.RoleName.toLowerCase() === 'faculty') && user.isActive
        );
      },
      error: (error) => {
        console.error('Error fetching active faculty users:', error);
        this.showToastNotification('Error fetching active faculty users', 'error');
      }
    });
  }

  openAssignModal(department: Department): void {
    this.selectedDepartment = department;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedDepartment = null;
  }

  assignCoordinator(department: Department, userId: number): void {
    this.coordinatorService.assignCoordinator(department.DepartmentID, userId).subscribe({
      next: (coordinator: Coordinator) => {
        department.Coordinator = coordinator;
        this.showToastNotification('Coordinator assigned successfully', 'success');
        this.closeAssignModal();
        this.loadDepartments(); // Reload departments to reflect changes
      },
      error: (error) => {
        console.error('Error assigning coordinator:', error);
        this.showToastNotification('Error assigning coordinator', 'error');
      }
    });
  }

  removeCoordinator(department: Department): void {
    if (!department.Coordinator) {
      this.showToastNotification('No coordinator assigned to remove', 'warning');
      return;
    }
    this.coordinatorService.removeCoordinator(department.DepartmentID).subscribe({
      next: () => {
        department.Coordinator = null;
        this.showToastNotification('Coordinator removed successfully', 'success');
        this.loadDepartments(); // Reload departments to reflect changes
      },
      error: (error) => {
        console.error('Error removing coordinator:', error);
        this.showToastNotification('Error removing coordinator: ' + error.message, 'error');
      }
    });
  }

  updateUserDepartment(userId: number, departmentId: number): void {
    this.userManagementService.updateUserDepartment(userId, departmentId).subscribe({
      next: () => {
        const user = this.facultyUsers.find(u => u.UserID === userId);
        if (user) {
          user.Department = { DepartmentID: departmentId, DepartmentName: '' };
        }
      },
      error: (error) => {
        console.error('Error updating user department:', error);
        this.showToastNotification('Error updating user department', 'warning');
      }
    });
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { CampusContextService } from '../../services/campus-context.service';
import { Department } from '../../model/department.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DepartmentManagementComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  departmentForm: FormGroup;
  isEditing: boolean = false;
  currentDepartmentId: number | null = null;
  currentCampusId: number | null = null;
  private campusSubscription: Subscription | undefined;

  // Toast variables
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private departmentService: DepartmentService,
    private campusContextService: CampusContextService,
    private fb: FormBuilder
  ) {
    this.departmentForm = this.fb.group({
      DepartmentName: ['', [Validators.required, Validators.maxLength(100)]],
      Description: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.campusSubscription = this.campusContextService.getCampusId().subscribe(
      campusId => {
        this.currentCampusId = campusId;
        this.loadDepartments();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.campusSubscription) {
      this.campusSubscription.unsubscribe();
    }
  }

  loadDepartments(): void {
    if (this.currentCampusId === null) {
      this.showToastNotification('No campus selected', 'warning');
      return;
    }
    this.departmentService.getDepartments(this.currentCampusId).subscribe(
      (data) => {
        this.departments = data;
      },
      (error) => {
        this.showToastNotification('Error fetching departments', 'error');
        console.error('Error fetching departments', error);
      }
    );
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.showToastNotification('Please fill out all required fields.', 'warning');
      return;
    }

    const department: Department = {
      ...this.departmentForm.value,
      CollegeCampusID: this.currentCampusId
    };

    if (this.isEditing && this.currentDepartmentId !== null) {
      this.departmentService.updateDepartment(this.currentDepartmentId, department).subscribe(
        () => {
          this.loadDepartments();
          this.resetForm();
          this.showToastNotification('Department updated successfully', 'success');
        },
        (error) => {
          this.showToastNotification('Error updating department', 'error');
          console.error('Error updating department', error);
        }
      );
    } else {
      this.departmentService.addDepartment(department).subscribe(
        () => {
          this.loadDepartments();
          this.resetForm();
          this.showToastNotification('Department added successfully', 'success');
        },
        (error) => {
          this.showToastNotification('Error adding department', 'error');
          console.error('Error adding department', error);
        }
      );
    }
  }

  editDepartment(department: Department): void {
    this.isEditing = true;
    this.currentDepartmentId = department.DepartmentID ?? null;
    this.departmentForm.patchValue(department);
  }

  deleteDepartment(id: number | undefined): void {
    if (id === undefined) {
      this.showToastNotification('Cannot delete department with undefined ID', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(
        () => {
          this.loadDepartments();
          this.showToastNotification('Department deleted successfully', 'success');
        },
        (error) => {
          this.showToastNotification('Error deleting department', 'error');
          console.error('Error deleting department', error);
        }
      );
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentDepartmentId = null;
    this.departmentForm.reset();
  }

  // Toast Notification Method
  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Toast disappears after 3 seconds
  }
}

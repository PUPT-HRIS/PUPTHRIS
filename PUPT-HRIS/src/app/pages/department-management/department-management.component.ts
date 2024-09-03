import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../model/department.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DepartmentManagementComponent implements OnInit {
  departments: Department[] = [];
  departmentForm: FormGroup;
  isEditing: boolean = false;
  currentDepartmentId: number | null = null;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {
    this.departmentForm = this.fb.group({
      DepartmentName: ['', [Validators.required, Validators.maxLength(100)]],
      Description: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data) => {
        this.departments = data;
      },
      (error) => {
        console.error('Error fetching departments', error);
      }
    );
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return;
    }

    const department: Department = this.departmentForm.value;

    if (this.isEditing && this.currentDepartmentId !== null) {
      this.departmentService.updateDepartment(this.currentDepartmentId, department).subscribe(
        () => {
          this.loadDepartments();
          this.resetForm();
        },
        (error) => {
          console.error('Error updating department', error);
        }
      );
    } else {
      this.departmentService.addDepartment(department).subscribe(
        () => {
          this.loadDepartments();
          this.resetForm();
        },
        (error) => {
          console.error('Error adding department', error);
        }
      );
    }
  }

  editDepartment(department: Department): void {
    this.isEditing = true;
    this.currentDepartmentId = department.DepartmentID;
    this.departmentForm.patchValue(department);
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(
        () => {
          this.loadDepartments();
        },
        (error) => {
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
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkExperience } from '../../model/work.model';
import { WorkService } from '../../services/work.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-workexperience',
  templateUrl: './workexperience.component.html',
  styleUrls: ['./workexperience.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class WorkExperienceComponent implements OnInit {
  workExperienceForm: FormGroup;
  workExperienceData: WorkExperience[] = [];
  isEditing: boolean = false;
  currentExperienceId: number | null = null;
  employeeId: number;

  constructor(private fb: FormBuilder, private workService: WorkService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.employeeId = decoded.userId;
    } else {
      this.employeeId = 0;
    }

    this.workExperienceForm = this.fb.group({
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      PositionTitle: [''],
      DepartmentAgencyOfficeCompany: [''],
      MonthlySalary: [''],
      SalaryJobPayGrade: [''],
      StatusOfAppointment: [''],
      GovtService: [false]
    });
  }

  ngOnInit(): void {
    this.loadWorkExperiences();
  }

  loadWorkExperiences(): void {
    this.workService.getWorkExperiences(this.employeeId).subscribe(
      data => {
        this.workExperienceData = data;
      },
      error => {
        console.error('Error fetching work experiences', error);
      }
    );
  }

  resetForm(): void {
    this.workExperienceForm.reset();
    this.currentExperienceId = null;
    this.isEditing = false;
  }

  onSubmit(): void {
    const workExperience = { ...this.workExperienceForm.value, EmployeeID: this.employeeId };
    if (this.currentExperienceId) {
      this.workService.updateWorkExperience(this.currentExperienceId, workExperience).subscribe(
        response => {
          console.log('Work experience updated successfully', response);
          this.loadWorkExperiences();
          this.resetForm();
        },
        error => {
          console.error('Error updating work experience', error);
        }
      );
    } else {
      this.workService.addWorkExperience(workExperience).subscribe(
        response => {
          console.log('Work experience added successfully', response);
          this.loadWorkExperiences();
          this.resetForm();
        },
        error => {
          console.error('Error adding work experience', error);
        }
      );
    }
  }

  editExperience(id: number): void {
    const experience = this.workExperienceData.find(ex => ex.WorkExperienceID === id);
    if (experience) {
      this.workExperienceForm.patchValue(experience);
      this.currentExperienceId = id;
      this.isEditing = true;
    }
  }

  deleteExperience(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.workService.deleteWorkExperience(id).subscribe(
        response => {
          console.log('Work experience deleted successfully', response);
          this.loadWorkExperiences();
        },
        error => {
          console.error('Error deleting work experience', error);
        }
      );
    }
  }

  addNewExperience(): void {
    this.resetForm();
    this.isEditing = true;
  }
}

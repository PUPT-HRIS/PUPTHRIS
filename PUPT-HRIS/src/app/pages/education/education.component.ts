import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EducationService } from '../../services/education.service';
import { Education } from '../../model/education.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EducationComponent implements OnInit {
  educationForm: FormGroup;
  educationData: Education[] = [];
  isEditing: boolean = false;
  currentEducationId: number | null = null;
  employeeId: number;

  constructor(private fb: FormBuilder, private educationService: EducationService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.employeeId = decoded.userId;
    } else {
      // Handle error or redirect to login
      this.employeeId = 0;
    }

    this.educationForm = this.fb.group({
      Level: [''],
      NameOfSchool: [''],
      BasicEducationDegreeCourse: [''],
      PeriodOfAttendanceFrom: [''],
      PeriodOfAttendanceTo: [''],
      HighestLevelUnitsEarned: [''],
      YearGraduated: [''],
      AcademicHonors: ['']
    });
  }

  ngOnInit(): void {
    this.loadEducation();
  }

  loadEducation(): void {
    this.educationService.getEducationByEmployee(this.employeeId).subscribe(
      data => {
        this.educationData = data;
      },
      error => {
        console.error('Error fetching education data', error);
      }
    );
  }

  toggleForm(id?: number): void {
    this.isEditing = !this.isEditing;
    if (id) {
      const education = this.educationData.find(e => e.EducationID === id);
      if (education) {
        this.educationForm.patchValue(education);
        this.currentEducationId = id;
      }
    } else {
      this.educationForm.reset();
      this.currentEducationId = null;
    }
  }

  onSubmit(): void {
    const education = { ...this.educationForm.value, EmployeeID: this.employeeId };
    if (this.currentEducationId) {
      this.educationService.updateEducation(this.currentEducationId, education).subscribe(
        response => {
          console.log('Education updated successfully', response);
          this.loadEducation();
          this.isEditing = false;
          this.currentEducationId = null;
        },
        error => {
          console.error('Error updating education', error);
        }
      );
    } else {
      this.educationService.addEducation(education).subscribe(
        response => {
          console.log('Education added successfully', response);
          this.loadEducation();
          this.isEditing = false;
        },
        error => {
          console.error('Error adding education', error);
        }
      );
    }
  }
}

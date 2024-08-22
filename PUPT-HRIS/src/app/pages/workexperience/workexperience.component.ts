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
  userId: number;
  initialFormValue: any;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private workService: WorkService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
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
    this.workService.getWorkExperiences(this.userId).subscribe(
      data => {
        this.workExperienceData = data;
      },
      error => {
        this.showToastNotification('Error fetching work experiences.', 'error');
        console.error('Error fetching work experiences', error);
      }
    );
  }

  resetForm(showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges()) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    this.workExperienceForm.reset();
    this.currentExperienceId = null;
    this.isEditing = false;
    this.initialFormValue = this.workExperienceForm.getRawValue(); // Store the initial form value for new form
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const workExperience = { ...this.workExperienceForm.value, UserID: this.userId };
    if (this.currentExperienceId) {
      this.workService.updateWorkExperience(this.currentExperienceId, workExperience).subscribe(
        response => {
          this.loadWorkExperiences();
          this.resetForm();
          this.showToastNotification('Work experience updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating work experience', error);
        }
      );
    } else {
      this.workService.addWorkExperience(workExperience).subscribe(
        response => {
          this.loadWorkExperiences();
          this.resetForm();
          this.showToastNotification('Work experience added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
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
      this.initialFormValue = this.workExperienceForm.getRawValue(); // Store the initial form value
    }
  }

  deleteExperience(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.workService.deleteWorkExperience(id).subscribe(
        response => {
          this.workExperienceData = this.workExperienceData.filter(ex => ex.WorkExperienceID !== id);
          this.showToastNotification('Work experience deleted successfully.', 'error');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting work experience', error);
        }
      );
    }
  }

  addNewExperience(): void {
    this.resetForm(false); // Avoid showing the toast on the first click
    this.isEditing = true;
    this.initialFormValue = this.workExperienceForm.getRawValue(); // Store the initial form value for new form
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.workExperienceForm.getRawValue();
    return JSON.stringify(currentFormValue) !== JSON.stringify(this.initialFormValue);
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

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
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  levels: string[] = [
    'ELEMENTARY',
    'SECONDARY',
    'VOCATIONAL / TRADE COURSE',
    'COLLEGE',
    'GRADUATE STUDIES',
    `MASTER'S`,
    'DOCTORATE'
  ];

  constructor(private fb: FormBuilder, private educationService: EducationService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
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
    this.educationService.getEducationByUser(this.userId).subscribe(
      data => {
        this.educationData = data;
      },
      error => {
        this.showToastNotification('Error fetching education data.', 'error');
        console.error('Error fetching education data', error);
      }
    );
  }

  toggleForm(id?: number): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing && id) {
      const education = this.educationData.find(e => e.EducationID === id);
      if (education) {
        this.educationForm.patchValue(education);
        this.currentEducationId = id;
        this.initialFormValue = this.educationForm.getRawValue(); // Store the initial form value
      }
    } else if (this.isEditing) {
      this.educationForm.reset();
      this.currentEducationId = null;
      this.initialFormValue = this.educationForm.getRawValue(); // Store the initial form value for new form
    } else {
      if (this.hasUnsavedChanges()) { // Check for unsaved changes before canceling
        this.showToastNotification('The changes are not saved.', 'error');
      }
    }
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const education = { ...this.educationForm.value, UserID: this.userId };

    if (this.currentEducationId) {
      this.educationService.updateEducation(this.currentEducationId, education).subscribe(
        response => {
          this.loadEducation();
          this.isEditing = false;
          this.currentEducationId = null;
          this.showToastNotification('Information updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating education', error);
        }
      );
    } else {
      this.educationService.addEducation(education).subscribe(
        response => {
          this.loadEducation();
          this.isEditing = false;
          this.showToastNotification('Education added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding education', error);
        }
      );
    }
  }

  deleteEducation(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.educationService.deleteEducation(id).subscribe(
        response => {
          this.loadEducation();
          this.showToastNotification('Education record deleted successfully.', 'error');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting education', error);
        }
      );
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.educationForm.getRawValue();
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

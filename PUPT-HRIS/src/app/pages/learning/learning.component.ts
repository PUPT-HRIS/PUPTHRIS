import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LearningService } from '../../services/learning.service';
import { LearningDevelopment } from '../../model/learning-development.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LearningComponent implements OnInit {
  learningForm: FormGroup;
  learningData: LearningDevelopment[] = [];
  isEditing: boolean = false;
  currentLearningId: number | null = null;
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private learningService: LearningService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.learningForm = this.fb.group({
      TitleOfLearningDevelopment: [''],
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      NumberOfHours: [''],
      TypeOfLD: [''],
      ConductedSponsoredBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadLearningDevelopments();
  }

  loadLearningDevelopments(): void {
    this.learningService.getLearningDevelopments(this.userId).subscribe(
      data => {
        this.learningData = data;
      },
      error => {
        this.showToastNotification('Error fetching learning developments.', 'error');
        console.error('Error fetching learning developments', error);
      }
    );
  }

  resetForm(showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges()) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    this.learningForm.reset();
    this.currentLearningId = null;
    this.isEditing = false;
    this.initialFormValue = this.learningForm.getRawValue(); // Store the initial form value for new form
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const formData = { ...this.learningForm.value, UserID: this.userId };
    if (this.currentLearningId) {
      this.learningService.updateLearningDevelopment(this.currentLearningId, formData).subscribe(
        response => {
          this.loadLearningDevelopments();
          this.resetForm();
          this.showToastNotification('Learning development updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating learning development', error);
        }
      );
    } else {
      this.learningService.addLearningDevelopment(formData).subscribe(
        response => {
          this.loadLearningDevelopments();
          this.resetForm();
          this.showToastNotification('Learning development added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding learning development', error);
        }
      );
    }
  }

  editLearning(id: number): void {
    const learning = this.learningData.find(ld => ld.LearningDevelopmentID === id);
    if (learning) {
      this.learningForm.patchValue(learning);
      this.currentLearningId = id;
      this.isEditing = true;
      this.initialFormValue = this.learningForm.getRawValue(); // Store the initial form value
    }
  }

  deleteLearning(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.learningService.deleteLearningDevelopment(id).subscribe(
        response => {
          console.log('Learning development deleted successfully', response);
          this.learningData = this.learningData.filter(ld => ld.LearningDevelopmentID !== id);
          this.showToastNotification('Learning development deleted successfully.', 'error');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting learning development', error);
        }
      );
    }
  }

  addNewLearning(): void {
    this.resetForm(false); // Avoid showing the toast on the first click
    this.isEditing = true;
    this.initialFormValue = this.learningForm.getRawValue(); // Store the initial form value for new form
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.learningForm.getRawValue();
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

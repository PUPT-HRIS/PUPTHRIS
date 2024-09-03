import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AchievementAward } from '../../model/achievement-awards.model';
import { AchievementAwardService } from '../../services/achievement-awards.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement-award',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule]
})
export class AchievementAwardComponent implements OnInit {
  achievementAwardForm: FormGroup;
  achievementAwardsData: AchievementAward[] = [];
  isEditing: boolean = false;
  currentAchievementAwardId: number | null | undefined = null;
  userId: number;
  initialFormValue: any; // To store the initial form value
  fileToUpload: File | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private achievementAwardService: AchievementAwardService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.achievementAwardForm = this.fb.group({
      NatureOfAchievement: [''],
      Classification: [''],
      Level: [''],
      AwardingBody: [''],
      Venue: [''],
      InclusiveDates: [''],
      Remarks: ['']
    });
  }

  ngOnInit(): void {
    this.loadAchievementAwards();
  }

  loadAchievementAwards(): void {
    this.achievementAwardService.getAchievementAwards(this.userId).subscribe(
      data => {
        this.achievementAwardsData = data;
      },
      error => {
        this.showToastNotification('Error fetching achievement awards data.', 'error');
        console.error('Error fetching achievement awards data', error);
      }
    );
  }

  editAchievementAward(id: number): void {
    const award = this.achievementAwardsData.find(a => a.AchievementID === id);
    if (award) {
      this.isEditing = true;
      this.currentAchievementAwardId = id;
      this.achievementAwardForm.patchValue(award);
      this.initialFormValue = this.achievementAwardForm.getRawValue(); // Store the initial form value
    }
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.achievementAwardForm.reset();
      this.currentAchievementAwardId = null;
      this.initialFormValue = this.achievementAwardForm.getRawValue(); // Store the initial form value for new form
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

    const formData = new FormData();
    
    // Append form fields to FormData
    formData.append('NatureOfAchievement', this.achievementAwardForm.get('NatureOfAchievement')?.value || '');
    formData.append('Classification', this.achievementAwardForm.get('Classification')?.value || '');
    formData.append('Level', this.achievementAwardForm.get('Level')?.value || '');
    formData.append('AwardingBody', this.achievementAwardForm.get('AwardingBody')?.value || '');
    formData.append('Venue', this.achievementAwardForm.get('Venue')?.value || '');
    formData.append('InclusiveDates', this.achievementAwardForm.get('InclusiveDates')?.value || '');
    formData.append('Remarks', this.achievementAwardForm.get('Remarks')?.value || '');

    // Append the UserID manually
    formData.append('UserID', this.userId.toString());

    // Append file to FormData if there is one
    if (this.fileToUpload) {
      formData.append('SupportingDocument', this.fileToUpload);
    }

    if (this.currentAchievementAwardId) {
      this.achievementAwardService.updateAchievementAward(this.currentAchievementAwardId, formData).subscribe(
        response => {
          this.loadAchievementAwards();
          this.resetForm();
          this.showToastNotification('Achievement award updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating achievement award', error);
        }
      );
    } else {
      this.achievementAwardService.addAchievementAward(formData).subscribe(
        response => {
          this.loadAchievementAwards();
          this.resetForm();
          this.showToastNotification('Achievement award added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding achievement award', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
    }
  }

  deleteAchievementAward(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.achievementAwardService.deleteAchievementAward(id).subscribe(
        response => {
          this.loadAchievementAwards();
          this.showToastNotification('Achievement award deleted successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting achievement award', error);
        }
      );
    }
  }

  addNewAchievementAward(): void {
    this.resetForm(false); // Reset form without showing a toast
    this.isEditing = true;
    this.initialFormValue = this.achievementAwardForm.getRawValue(); // Set initial value for the new form
  }

  resetForm(showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges()) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    this.achievementAwardForm.reset();
    this.fileToUpload = null;
    this.currentAchievementAwardId = null;
    this.isEditing = false;
    this.initialFormValue = this.achievementAwardForm.getRawValue(); // Reset initial form value after reset
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.achievementAwardForm.getRawValue();
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

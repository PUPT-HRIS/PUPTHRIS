import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AcademicRankService } from '../../services/academic-rank.service';
import { AuthService } from '../../services/auth.service';
import { AcademicRank } from '../../model/academicRank.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-academic-rank',
  templateUrl: './academic-rank.component.html',
  styleUrls: ['./academic-rank.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AcademicRankComponent implements OnInit {
  academicRankForm: FormGroup;
  academicRank: AcademicRank | null = null;
  isEditing: boolean = false;
  userId: number;
  initialFormValue: any;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private academicRankService: AcademicRankService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.academicRankForm = this.fb.group({
      Rank: ['', Validators.required],
      UserID: [this.userId]
    });
  }

  ngOnInit(): void {
    this.getAcademicRank();
  }

  getAcademicRank(): void {
    this.academicRankService.getAcademicRank(this.userId).subscribe(
      (rank) => {
        if (rank) {
          this.academicRank = rank;
          this.academicRankForm.patchValue(rank);
        } else {
          this.academicRank = null;
          this.academicRankForm.reset({ Rank: '', UserID: this.userId });
        }
        this.initialFormValue = this.academicRankForm.getRawValue();
      },
      (error) => {
        console.error('Error fetching academic rank:', error);
        this.academicRank = null;
        this.academicRankForm.reset({ Rank: '', UserID: this.userId });
      }
    );
  }

  edit(): void {
    this.isEditing = true;
    this.initialFormValue = this.academicRankForm.getRawValue();
  }

  cancelEdit(): void {
    if (this.hasUnsavedChanges()) {
      this.showToastNotification('Changes have not been saved.', 'error');
    }
    this.isEditing = false;
    this.academicRankForm.patchValue(this.academicRank || {});
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    if (this.academicRankForm.valid) {
      const rank: AcademicRank = this.academicRankForm.value;
      rank.UserID = this.userId;

      this.academicRankService.addOrUpdateAcademicRank(rank).subscribe(
        (updatedRank) => {
          this.academicRank = updatedRank.academicRank; // Update this line
          this.isEditing = false;
          this.showToastNotification('Changes have been saved successfully.', 'success');
          this.refreshAcademicRank(); // Add this line
        },
        (error) => {
          console.error('Error updating academic rank:', error);
          this.showToastNotification('An error occurred while saving changes.', 'error');
        }
      );
    } else {
      this.showToastNotification('Please correct the highlighted errors before saving.', 'error');
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.academicRankForm.getRawValue();
    return JSON.stringify(currentFormValue) !== JSON.stringify(this.initialFormValue);
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Add this new method
  private refreshAcademicRank(): void {
    this.getAcademicRank();
  }
}
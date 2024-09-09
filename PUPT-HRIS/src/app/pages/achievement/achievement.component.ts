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
  imports: [CommonModule, ReactiveFormsModule]
})
export class AchievementAwardComponent implements OnInit {
  achievementAwardForm: FormGroup;
  achievementAwards: AchievementAward[] = [];
  paginatedAchievementAwards: AchievementAward[] = [];
  isEditing: boolean = false;
  currentAchievementId: number | null = null;
  userId: number;
  fileToUpload: File | null = null;
  selectedFileName: string | null = null;
  isModalOpen: boolean = false;

  selectedProofUrl: string | null = null;
  selectedSupportingDocument: string | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(
    private fb: FormBuilder,
    private achievementAwardService: AchievementAwardService,
    private authService: AuthService
  ) {
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
      Remarks: [''],
      SupportingDocument: [''], 
      Proof: ['']           
    });
  }

  ngOnInit(): void {
    this.loadAchievementAwards();
  }

  loadAchievementAwards(): void {
    this.achievementAwardService.getAchievementsByUserId(this.userId).subscribe(
      (data) => {
        this.achievementAwards = data;
        this.totalPages = Math.ceil(this.achievementAwards.length / this.itemsPerPage);
        this.updatePaginatedData();
      },
      (error) => {
        if (error.status !== 404) {
          this.showToastNotification('Error fetching achievement awards data.', 'error');
        }
        console.error('Error fetching achievement awards data', error);
      }
    );
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAchievementAwards = this.achievementAwards.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  addNewAchievementAward(): void {
    this.resetForm(false);
    this.isEditing = true;
  }

  editAchievementAward(id: number): void {
    const award = this.achievementAwards.find(a => a.AchievementID === id);
    if (award) {
      this.isEditing = true;
      this.currentAchievementId = id;
      this.achievementAwardForm.patchValue(award);
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    Object.keys(this.achievementAwardForm.value).forEach((key) => {
      formData.append(key, this.achievementAwardForm.get(key)?.value || '');
    });

    formData.append('UserID', this.userId.toString());

    if (this.fileToUpload) {
      formData.append('proof', this.fileToUpload);
    }

    if (this.currentAchievementId) {
      this.achievementAwardService.updateAchievement(this.currentAchievementId, formData).subscribe(
        (response) => {
          this.loadAchievementAwards();
          this.resetForm();
          this.showToastNotification('Achievement award updated successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('Error updating achievement award.', 'error');
          console.error('Error updating achievement award', error);
        }
      );
    } else {
      this.achievementAwardService.addAchievement(formData).subscribe(
        (response) => {
          this.loadAchievementAwards();
          this.resetForm();
          this.showToastNotification('Achievement award added successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('Error adding achievement award.', 'error');
          console.error('Error adding achievement award', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.selectedFileName = file.name;
    }
  }

  deleteAchievementAward(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.achievementAwardService.deleteAchievement(id).subscribe(
        (response) => {
          this.achievementAwards = this.achievementAwards.filter(award => award.AchievementID !== id);
          this.showToastNotification('Achievement award deleted successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('Error deleting achievement award.', 'error');
          console.error('Error deleting achievement award', error);
        }
      );
    }
  }

  openProofModal(proofUrl: string, supportingDocument?: string): void {
    this.selectedProofUrl = proofUrl;
    this.selectedSupportingDocument = supportingDocument || 'No description available';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.selectedProofUrl = null;
    this.isModalOpen = false;
  }

  resetForm(showToast: boolean = true): void {
    this.achievementAwardForm.reset();
    this.fileToUpload = null;
    this.selectedFileName = null;
    this.currentAchievementId = null;
    this.isEditing = false;
    if (showToast) {
      this.showToastNotification('Form reset', 'warning');
    }
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  }

  onImageError(): void {
    alert('Failed to load image. Please check the URL.');
  }

  showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrainingSeminarsService } from '../../services/training-seminars.service';
import { TrainingSeminar } from '../../model/training-seminars.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-training-seminars',
  templateUrl: './training-seminars.component.html',
  styleUrls: ['./training-seminars.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class TrainingSeminarsComponent implements OnInit {
  trainingForm: FormGroup;
  trainingData: TrainingSeminar[] = [];
  paginatedTrainingData: TrainingSeminar[] = [];
  isEditing: boolean = false;
  currentTrainingId: number | null | undefined = null;
  userId: number;
  initialFormValue: any;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private trainingService: TrainingSeminarsService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.trainingForm = this.fb.group({
      TrainingTitle: [''],
      DateFrom: [''],
      DateTo: [''],
      ConductedBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getTrainings(this.userId).subscribe(
      data => {
        this.trainingData = data;
        this.totalPages = Math.ceil(this.trainingData.length / this.itemsPerPage);
        this.updatePaginatedData();
      },
      error => {
        this.showToastNotification('Error fetching trainings data.', 'error');
        console.error('Error fetching trainings data', error);
      }
    );
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTrainingData = this.trainingData.slice(startIndex, endIndex);
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

  editTraining(training: TrainingSeminar): void {
    this.isEditing = true;
    this.currentTrainingId = training.TrainingID;
    this.trainingForm.patchValue(training);
    this.initialFormValue = this.trainingForm.getRawValue();
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.trainingForm.reset();
      this.currentTrainingId = null;
      this.initialFormValue = this.trainingForm.getRawValue();
    } else {
      if (this.hasUnsavedChanges()) {
        this.showToastNotification('The changes are not saved.', 'error');
      }
    }
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const trainingData = { ...this.trainingForm.value, UserID: this.userId };

    if (this.currentTrainingId !== null && this.currentTrainingId !== undefined) {
      this.trainingService.updateTraining(this.currentTrainingId, trainingData).subscribe(
        response => {
          this.loadTrainings();
          this.toggleForm();
          this.showToastNotification('Information updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating training', error);
        }
      );
    } else {
      this.trainingService.addTraining(trainingData).subscribe(
        response => {
          this.loadTrainings();
          this.toggleForm();
          this.showToastNotification('Training added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding training', error);
        }
      );
    }
  }

  deleteTraining(id: number | undefined): void {
    if (id === undefined) {
      this.showToastNotification('Invalid Training ID.', 'error');
      return;
    }
  
    if (confirm('Are you sure you want to delete this training?')) {
      this.trainingService.deleteTraining(id).subscribe(
        response => {
          this.loadTrainings();
          this.showToastNotification('Training record deleted successfully.', 'success');
        },
        error => {
          this.showToastNotification('There was an error deleting the training.', 'error');
          console.error('Error deleting training', error);
        }
      );
    }
  }  

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.trainingForm.getRawValue();
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

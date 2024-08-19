import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VoluntaryWorkService } from '../../services/voluntarywork.service';
import { VoluntaryWork } from '../../model/voluntary-work.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-voluntarywork',
  templateUrl: './voluntarywork.component.html',
  styleUrls: ['./voluntarywork.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class VoluntaryWorkComponent implements OnInit {
  voluntaryWorkForm: FormGroup;
  voluntaryWorkData: VoluntaryWork[] = [];
  isEditing: boolean = false;
  currentVoluntaryWorkId: number | null = null;
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private voluntaryWorkService: VoluntaryWorkService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.voluntaryWorkForm = this.fb.group({
      OrganizationNameAddress: [''],
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      NumberOfHours: [''],
      PositionNatureOfWork: ['']
    });
  }

  ngOnInit(): void {
    this.loadVoluntaryWorks();
  }

  loadVoluntaryWorks(): void {
    this.voluntaryWorkService.getVoluntaryWorks(this.userId).subscribe(
      data => {
        this.voluntaryWorkData = data;
      },
      error => {
        this.showToastNotification('Error fetching voluntary works.', 'error');
        console.error('Error fetching voluntary works', error);
      }
    );
  }

  resetForm(showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges()) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    this.voluntaryWorkForm.reset();
    this.currentVoluntaryWorkId = null;
    this.isEditing = false;
    this.initialFormValue = this.voluntaryWorkForm.getRawValue(); // Store the initial form value for new form
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const voluntaryWork = { ...this.voluntaryWorkForm.value, UserID: this.userId };
    if (this.currentVoluntaryWorkId) {
      this.voluntaryWorkService.updateVoluntaryWork(this.currentVoluntaryWorkId, voluntaryWork).subscribe(
        response => {
          this.loadVoluntaryWorks();
          this.resetForm();
          this.showToastNotification('Voluntary work updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating voluntary work', error);
        }
      );
    } else {
      this.voluntaryWorkService.addVoluntaryWork(voluntaryWork).subscribe(
        response => {
          this.loadVoluntaryWorks();
          this.resetForm();
          this.showToastNotification('Voluntary work added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding voluntary work', error);
        }
      );
    }
  }

  editVoluntaryWork(id: number): void {
    const voluntaryWork = this.voluntaryWorkData.find(vw => vw.VoluntaryWorkID === id);
    if (voluntaryWork) {
      this.voluntaryWorkForm.patchValue(voluntaryWork);
      this.currentVoluntaryWorkId = id;
      this.isEditing = true;
      this.initialFormValue = this.voluntaryWorkForm.getRawValue(); // Store the initial form value
    }
  }

  deleteVoluntaryWork(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.voluntaryWorkService.deleteVoluntaryWork(id).subscribe(
        response => {
          this.voluntaryWorkData = this.voluntaryWorkData.filter(vw => vw.VoluntaryWorkID !== id);
          this.showToastNotification('Voluntary work deleted successfully.', 'error');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting voluntary work', error);
        }
      );
    }
  }

  addNewVoluntaryWork(): void {
    this.resetForm(false); // Avoid showing the toast on the first click
    this.isEditing = true;
    this.initialFormValue = this.voluntaryWorkForm.getRawValue(); // Store the initial form value for new form
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.voluntaryWorkForm.getRawValue();
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

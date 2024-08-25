import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasicDetailsService } from '../../services/basic-details.service';
import { AuthService } from '../../services/auth.service';
import { BasicDetails } from '../../model/basic-details.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class BasicDetailsComponent implements OnInit {
  basicDetailsForm: FormGroup;
  basicDetails: BasicDetails | null = null;
  isEditing: boolean = false;
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private basicDetailsService: BasicDetailsService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.basicDetailsForm = this.fb.group({
      LastName: ['', Validators.required],
      FirstName: ['', Validators.required],
      MiddleInitial: [''],
      NameExtension: [''],
      FacultyCode: ['', Validators.required],
      Honorific: [''],
      EmployeeNo: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      Sex: ['', Validators.required],
      UserID: [this.userId]
    });
  }

  ngOnInit(): void {
    this.getBasicDetails();
  }

  getBasicDetails(): void {
    this.basicDetailsService.getBasicDetails(this.userId).subscribe(
      (details) => {
        this.basicDetails = details;
        this.basicDetailsForm.patchValue(details || {});
      },
      (error) => console.error('Error fetching basic details:', error)
    );
  }

  edit(): void {
    this.isEditing = true;
    this.initialFormValue = this.basicDetailsForm.getRawValue(); // Store the initial form value
  }

  cancelEdit(): void {
    if (this.hasUnsavedChanges()) { // Check for unsaved changes
      this.showToastNotification('Changes have not been saved.', 'error');
    }
    this.isEditing = false;
    this.basicDetailsForm.patchValue(this.basicDetails || {});
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    if (this.basicDetailsForm.valid) {
      const details: BasicDetails = this.basicDetailsForm.value;
      details.UserID = this.userId;
  
      if (this.basicDetails) {
        this.basicDetailsService.updateBasicDetails(this.basicDetails.BasicDetailsID!, details).subscribe(
          (updatedDetails) => {
            this.basicDetails = updatedDetails;
            this.isEditing = false;
            this.showToastNotification('Changes have been saved successfully.', 'success');
          },
          (error) => {
            console.error('Error updating basic details:', error);
            this.showToastNotification('An error occurred while saving changes.', 'error');
          }
        );
      } else {
        this.basicDetailsService.addBasicDetails(details).subscribe(
          (newDetails) => {
            this.basicDetails = newDetails;
            this.isEditing = false;
            this.showToastNotification('Changes have been saved successfully.', 'success');
          },
          (error) => {
            console.error('Error adding basic details:', error);
            this.showToastNotification('An error occurred while saving changes.', 'error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.basicDetailsForm.getRawValue();
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactDetailsService } from '../../services/contact-details.service';
import { AuthService } from '../../services/auth.service';
import { ContactDetails } from '../../model/contact-details.model';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactDetailsComponent implements OnInit {
  contactDetailsForm: FormGroup;
  contactDetails: ContactDetails | null = null;
  isEditing: boolean = false;
  userId: number;
  initialFormValue: any;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  submitted: boolean = false; // Track form submission

  constructor(
    private fb: FormBuilder,
    private contactDetailsService: ContactDetailsService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.contactDetailsForm = this.fb.group({
      TelephoneNumber: [''],
      MobileNumber: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      UserID: [this.userId]
    });
  }

  ngOnInit(): void {
    this.getContactDetails();
  }

  getContactDetails(): void {
    this.contactDetailsService.getContactDetails(this.userId).subscribe(
      (details) => {
        this.contactDetails = details;
        this.contactDetailsForm.patchValue(details || {});
        this.initialFormValue = this.contactDetailsForm.getRawValue();
      },
      (error) => console.error('Error fetching contact details:', error)
    );
  }

  edit(): void {
    this.isEditing = true;
    this.initialFormValue = this.contactDetailsForm.getRawValue();
  }

  cancelEdit(): void {
    if (this.hasUnsavedChanges()) { 
      this.showToastNotification('Changes have not been saved.', 'error');
    }
    this.isEditing = false;
    this.contactDetailsForm.patchValue(this.contactDetails || {});
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }
  
    if (this.contactDetailsForm.valid) {
      const details: ContactDetails = this.contactDetailsForm.value;
      details.UserID = this.userId;
  
      if (this.contactDetails) {
        this.contactDetailsService.updateContactDetails(this.contactDetails.ContactDetailsID!, details).subscribe(
          (updatedDetails) => {
            this.contactDetails = updatedDetails;
            this.isEditing = false;
            this.showToastNotification('Changes have been saved successfully.', 'success');
          },
          (error) => {
            console.error('Error updating contact details:', error);
            this.showToastNotification('An error occurred while saving changes.', 'error');
          }
        );
      } else {
        this.contactDetailsService.addContactDetails(details).subscribe(
          (newDetails) => {
            this.contactDetails = newDetails;
            this.isEditing = false;
            this.showToastNotification('Changes have been saved successfully.', 'success');
          },
          (error) => {
            console.error('Error adding contact details:', error);
            this.showToastNotification('An error occurred while saving changes.', 'error');
          }
        );
      }
    } else {
      this.showToastNotification('Please correct the highlighted errors before saving.', 'error');
    }
  }
  

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.contactDetailsForm.getRawValue();
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

  private markAllAsTouched(): void {
    Object.keys(this.contactDetailsForm.controls).forEach(field => {
      const control = this.contactDetailsForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}

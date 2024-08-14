import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactDetailsService } from '../../services/contact-details.service';
import { AuthService } from '../../services/auth.service';
import { ContactDetails } from '../../model/contact-details.model';
import { jwtDecode } from 'jwt-decode';
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
      },
      (error) => console.error('Error fetching contact details:', error)
    );
  }

  edit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.contactDetailsForm.patchValue(this.contactDetails || {});
  }

  onSubmit(): void {
    if (this.contactDetailsForm.valid) {
      const details: ContactDetails = this.contactDetailsForm.value;
      details.UserID = this.userId;
  
      if (this.contactDetails) {
        this.contactDetailsService.updateContactDetails(this.contactDetails.ContactDetailsID!, details).subscribe(
          (updatedDetails) => {
            this.contactDetails = updatedDetails;
            this.isEditing = false;
          },
          (error) => console.error('Error updating contact details:', error)
        );
      } else {
        this.contactDetailsService.addContactDetails(details).subscribe(
          (newDetails) => {
            this.contactDetails = newDetails;
            this.isEditing = false;
          },
          (error) => console.error('Error adding contact details:', error)
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }  
}

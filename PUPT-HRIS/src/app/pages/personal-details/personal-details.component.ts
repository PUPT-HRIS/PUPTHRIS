import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalDetailsService } from '../../services/personal-details.service';
import { AuthService } from '../../services/auth.service';
import { PersonalDetails } from '../../model/personal-details.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonalDetailsComponent implements OnInit {
  personalDetailsForm: FormGroup;
  personalDetails: PersonalDetails | null = null;
  isEditing: boolean = false;
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private personalDetailsService: PersonalDetailsService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.personalDetailsForm = this.fb.group({
      PlaceOfBirth: [''],
      CivilStatus: ['', Validators.required],
      OtherCivilStatus: [''],
      Height: [''],
      Weight: [''],
      BloodType: [''],
      GSISNumber: [''],
      PagIbigNumber: [''],
      PhilHealthNumber: [''],
      SSSNumber: [''],
      TINNumber: [''],
      AgencyEmployeeNumber: [''],
      CitizenshipType: ['', Validators.required],
      CitizenshipAcquisition: [''],
      CitizenshipCountry: [''],
      ResidentialHouseBlockLot: [''],
      ResidentialStreet: [''],
      ResidentialSubdivisionVillage: [''],
      ResidentialBarangay: [''],
      ResidentialCityMunicipality: [''],
      ResidentialProvince: [''],
      ResidentialZipCode: [''],
      PermanentHouseBlockLot: [''],
      PermanentStreet: [''],
      PermanentSubdivisionVillage: [''],
      PermanentBarangay: [''],
      PermanentCityMunicipality: [''],
      PermanentProvince: [''],
      PermanentZipCode: [''],
    });
  }

  ngOnInit(): void {
    this.loadPersonalDetails();
  }

  loadPersonalDetails(): void {
    this.personalDetailsService.getPersonalDetails(this.userId).subscribe(
      (data: PersonalDetails) => {
        if (data) {
          this.personalDetails = data;
          this.personalDetailsForm.patchValue(data);
          this.initialFormValue = this.personalDetailsForm.getRawValue(); // Store the initial form value
        }
      },
      (error) => {
        console.error('Error fetching personal details', error);
      }
    );
  }

  edit(): void {
    this.isEditing = true;
    this.initialFormValue = this.personalDetailsForm.getRawValue(); // Store the initial form value
  }

  cancelEdit(): void {
    if (this.hasUnsavedChanges()) { // Check for unsaved changes
      this.showToastNotification('Changes have not been saved.', 'error');
    }
    this.isEditing = false;
    this.personalDetailsForm.patchValue(this.personalDetails || {});
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    if (this.personalDetailsForm.valid) {
      const personalDetails: PersonalDetails = this.personalDetailsForm.value;
      personalDetails.UserID = this.userId;

      if (this.personalDetails) {
        this.personalDetailsService.updatePersonalDetails(this.personalDetails.PersonalDetailsID!, personalDetails).subscribe(
          (updatedDetails) => {
            this.personalDetails = updatedDetails;
            this.isEditing = false;
            this.showToastNotification('Changes have been saved successfully.', 'success');
          },
          (error) => {
            console.error('Error updating personal details:', error);
            this.showToastNotification('An error occurred while saving changes.', 'error');
          }
        );
      } else {
        this.personalDetailsService.addPersonalDetails(personalDetails).subscribe(
          (newDetails) => {
            this.personalDetails = newDetails;
            this.isEditing = false;
            this.showToastNotification('Changes have been saved successfully.', 'success');
          },
          (error) => {
            console.error('Error adding personal details:', error);
            this.showToastNotification('An error occurred while saving changes.', 'error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.personalDetailsForm.getRawValue();
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

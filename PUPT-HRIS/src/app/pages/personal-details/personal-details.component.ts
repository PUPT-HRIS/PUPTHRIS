import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalDetailsService } from '../../services/personal-details.service';
import { AuthService } from '../../services/auth.service';
import { PersonalDetails } from '../../model/personal-details.model';
import { jwtDecode} from 'jwt-decode'; // Correct import
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

  submitted: boolean = false; // Flag to track form submission

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
    this.submitted = true; // Mark form as submitted
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    if (this.personalDetailsForm.invalid) {
      this.markAllAsTouched(); // Trigger validation messages and highlighting
      this.showToastNotification('Please fill in all required fields.', 'error');
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

  private markAllAsTouched(): void {
    Object.keys(this.personalDetailsForm.controls).forEach(field => {
      const control = this.personalDetailsForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
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

  onCopyResidentialToPermanent(event: any): void {
    if (event.target.checked) {
      this.personalDetailsForm.patchValue({
        PermanentHouseBlockLot: this.personalDetailsForm.get('ResidentialHouseBlockLot')?.value,
        PermanentStreet: this.personalDetailsForm.get('ResidentialStreet')?.value,
        PermanentSubdivisionVillage: this.personalDetailsForm.get('ResidentialSubdivisionVillage')?.value,
        PermanentBarangay: this.personalDetailsForm.get('ResidentialBarangay')?.value,
        PermanentCityMunicipality: this.personalDetailsForm.get('ResidentialCityMunicipality')?.value,
        PermanentProvince: this.personalDetailsForm.get('ResidentialProvince')?.value,
        PermanentZipCode: this.personalDetailsForm.get('ResidentialZipCode')?.value,
      });
    } else {
      this.personalDetailsForm.patchValue({
        PermanentHouseBlockLot: '',
        PermanentStreet: '',
        PermanentSubdivisionVillage: '',
        PermanentBarangay: '',
        PermanentCityMunicipality: '',
        PermanentProvince: '',
        PermanentZipCode: '',
      });
    }
  }
}


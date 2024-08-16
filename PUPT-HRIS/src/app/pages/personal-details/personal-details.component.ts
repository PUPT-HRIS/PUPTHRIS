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
        }
      },
      (error) => {
        console.error('Error fetching personal details', error);
      }
    );
  }

  edit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.personalDetailsForm.patchValue(this.personalDetails || {});
  }

  onSubmit(): void {
    if (this.personalDetailsForm.valid) {
      const personalDetails: PersonalDetails = this.personalDetailsForm.value;
      personalDetails.UserID = this.userId;

      if (this.personalDetails) {
        this.personalDetailsService.updatePersonalDetails(this.personalDetails.PersonalDetailsID!, personalDetails).subscribe(
          (updatedDetails) => {
            this.personalDetails = updatedDetails;
            this.isEditing = false;
          },
          (error) => console.error('Error updating personal details:', error)
        );
      } else {
        this.personalDetailsService.addPersonalDetails(personalDetails).subscribe(
          (newDetails) => {
            this.personalDetails = newDetails;
            this.isEditing = false;
          },
          (error) => console.error('Error adding personal details:', error)
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

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
      FacultyCode: [''],
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
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.basicDetailsForm.patchValue(this.basicDetails || {});
  }

  onSubmit(): void {
    if (this.basicDetailsForm.valid) {
      const details: BasicDetails = this.basicDetailsForm.value;
      details.UserID = this.userId;
  
      if (this.basicDetails) {
        this.basicDetailsService.updateBasicDetails(this.basicDetails.BasicDetailsID!, details).subscribe(
          (updatedDetails) => {
            this.basicDetails = updatedDetails;
            this.isEditing = false;
          },
          (error) => console.error('Error updating basic details:', error)
        );
      } else {
        this.basicDetailsService.addBasicDetails(details).subscribe(
          (newDetails) => {
            this.basicDetails = newDetails;
            this.isEditing = false;
          },
          (error) => console.error('Error adding basic details:', error)
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }  
}

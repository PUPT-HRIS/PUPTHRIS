import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalInfoService } from '../../services/personal-info.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../model/employee.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;
  employee: Employee | null = null;
  isEditing: boolean = false;
  userId: number;

  constructor(
    private fb: FormBuilder,
    private personalInfoService: PersonalInfoService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.personalInfoForm = this.fb.group({
      LastName: ['', Validators.required],
      FirstName: ['', Validators.required],
      MiddleName: [''],
      NameExtension: [''],
      BirthDate: ['', Validators.required],
      PlaceOfBirth: [''],
      Gender: ['', Validators.required],
      CivilStatus: [''],
      Height: [''],
      Weight: [''],
      BloodType: [''],
      GSISNumber: [''],
      PagIbigNumber: [''],
      PhilHealthNumber: [''],
      SSSNumber: [''],
      TINNumber: [''],
      AgencyEmployeeNumber: [''],
      Citizenship: [''],
      ResidentialAddress: [''],
      ResidentialZipCode: [''],
      PermanentAddress: [''],
      PermanentZipCode: [''],
      TelephoneNumber: [''],
      MobileNumber: [''],
      EmailAddress: ['', [Validators.required, Validators.email]],
      UserID: [this.userId]
    });
  }

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee(): void {
    this.personalInfoService.getEmployee(this.userId).subscribe(
      (employee) => {
        this.employee = employee;
        this.personalInfoForm.patchValue(employee || {});
      },
      (error) => console.error('Error fetching employee:', error)
    );
  }

  edit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.personalInfoForm.patchValue(this.employee || {});
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      const employee: Employee = this.personalInfoForm.value;
      console.log('Form is valid, submitting:', employee);
      if (this.employee) {
        this.personalInfoService.updateEmployee(this.userId, employee).subscribe(
          (updatedEmployee) => {
            console.log('Employee updated:', updatedEmployee);
            this.employee = updatedEmployee;
            this.isEditing = false;
          },
          (error) => console.error('Error updating employee:', error)
        );
      } else {
        this.personalInfoService.addEmployee(employee).subscribe(
          (newEmployee) => {
            console.log('Employee added:', newEmployee);
            this.employee = newEmployee;
            this.isEditing = false;
          },
          (error) => console.error('Error adding employee:', error)
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

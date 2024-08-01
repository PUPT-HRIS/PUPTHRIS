import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersonalInfoService,} from '../../services/personal-info.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../model/employee.model';

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
  employeeId: number = 1; //employee ID

  constructor(
    private fb: FormBuilder,
    private personalInfoService: PersonalInfoService
  ) {
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
      UserID: ['']
    });
  }

  ngOnInit(): void {
    this.getEmployee(this.employeeId);
  }

  getEmployee(id: number): void {
    this.personalInfoService.getEmployee(id).subscribe(
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
      this.personalInfoService.updateEmployee(this.employeeId, employee).subscribe(
        (updatedEmployee) => {
          console.log('Employee updated:', updatedEmployee);
          this.employee = updatedEmployee;
          this.isEditing = false;
        },
        (error) => console.error('Error updating employee:', error)
      );
    }
  }
}

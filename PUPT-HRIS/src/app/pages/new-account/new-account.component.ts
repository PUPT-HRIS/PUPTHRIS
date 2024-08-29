import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewAccountComponent implements OnInit {
  newAccountForm: FormGroup;
  toastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.newAccountForm = this.fb.group({
      Fcode: ['', Validators.required],
      Surname: ['', Validators.required],
      FirstName: ['', Validators.required],
      MiddleName: [''],
      NameExtension: [''],
      Email: ['', [Validators.required, Validators.email]],
      EmploymentType: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Role: ['', Validators.required],
      Department: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.newAccountForm.get('Role')?.valueChanges.subscribe(role => {
      const departmentControl = this.newAccountForm.get('Department');
      if (role === 'staff') {
        departmentControl?.disable();
        departmentControl?.clearValidators();
        departmentControl?.setValue('');
      } else {
        departmentControl?.enable();
        departmentControl?.setValidators(Validators.required);
      }
      departmentControl?.updateValueAndValidity();
    });
  }

  generatePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  onGeneratePasswordClick(): void {
    const generatedPassword = this.generatePassword();
    this.newAccountForm.get('Password')?.setValue(generatedPassword);
  }

  showToast(type: 'success' | 'error', message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000); // Hide the toast after 3 seconds
  }

  onSubmit(): void {
    if (this.newAccountForm.valid) {
      const formData = this.newAccountForm.value;

      // Ensure the Department field is submitted with an empty string if the role is "Staff"
      if (formData.Role === 'staff') {
        formData.Department = ''; // Set to an empty string
      }

      this.userService.addUser(formData).subscribe({
        next: response => {
          this.showToast('success', 'Account created successfully');
          this.newAccountForm.reset();
          this.newAccountForm.markAsPristine();
        },
        error: error => {
          console.log("Backend error details:", error); // Log the exact error
          this.showToast('error', 'Error creating account');
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NewAccountComponent implements OnInit {
  newAccountForm: FormGroup;

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

  onSubmit(): void {
    if (this.newAccountForm.valid) {
      this.userService.addUser(this.newAccountForm.value).subscribe({
        next: response => {
          console.log('User added successfully', response);
        },
        error: error => {
          console.error('Error adding user', error);
        }
      });
    }
  }
}

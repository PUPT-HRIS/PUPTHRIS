import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../model/department.model';
import { Role } from '../../model/role.model'; // Import the Role model
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { trigger, transition, style, animate } from '@angular/animations'; // Import Angular animations

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [ // Add animations for toast
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class NewAccountComponent implements OnInit {
  newAccountForm: FormGroup;
  toastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  departments: Department[] = []; // Array to store departments
  roles: Role[] = []; // Use the Role model here

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private roleService: RoleService
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
      Roles: [[], Validators.required], // Multi-select for roles
      DepartmentID: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadRoles();  // Load roles on initialization

    this.newAccountForm.get('Roles')?.valueChanges.subscribe((selectedRoles: string[]) => {
      this.handleRoleSelection(selectedRoles);
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: roles => {
        this.roles = roles;
      },
      error: error => console.error('Error fetching roles', error)
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: departments => this.departments = departments,
      error: error => console.error('Error fetching departments', error)
    });
  }

  // Handle role selection logic
  handleRoleSelection(selectedRoles: string[]): void {
    const departmentControl = this.newAccountForm.get('DepartmentID');

    // Check if "staff" role is selected
    const isStaffSelected = selectedRoles.includes('staff'); // Adjust to your exact RoleID value for 'staff'

    if (isStaffSelected) {
      departmentControl?.disable();
      departmentControl?.setValue(''); // Clear department value when staff is selected
    } else {
      departmentControl?.enable();
    }
  }

  // Update selected roles when checkbox changes
  onRoleCheckboxChange(event: any): void {
    const selectedRoles = this.newAccountForm.get('Roles')?.value || [];
    const roleValue = event.target.value;

    if (event.target.checked) {
      selectedRoles.push(roleValue); // Add role if checked
    } else {
      const index = selectedRoles.indexOf(roleValue);
      if (index > -1) {
        selectedRoles.splice(index, 1); // Remove role if unchecked
      }
    }
    this.newAccountForm.get('Roles')?.setValue(selectedRoles); // Update the form control value
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

      // Ensure the DepartmentID field is submitted with null if the role is "Staff"
      if (formData.Roles.includes('staff')) {
        formData.DepartmentID = null; // Set to null if staff is selected
      }

      this.userService.addUser(formData).subscribe({
        next: response => {
          this.showToast('success', 'Account created successfully');
          // Delay the form reset to allow the toast to display
          setTimeout(() => {
            this.newAccountForm.reset();
            this.newAccountForm.markAsPristine();
          }, 100); // Adjust the delay as needed
        },
        error: error => {
          console.log("Backend error details:", error); // Log the exact error
          this.showToast('error', 'Error creating account');
        }
      });
    }
  }
}

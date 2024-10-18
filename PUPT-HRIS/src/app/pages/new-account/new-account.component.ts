import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../model/department.model';
import { Role } from '../../model/role.model'; // Import the Role model
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { CollegeCampusService } from '../../services/college-campus.service';
import { CollegeCampus } from '../../model/college-campus.model';
import { AuthService } from '../../services/auth.service'; // Add this import

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
  departments: Department[] = []; // Array to store departments
  roles: Role[] = []; // Use the Role model here
  collegeCampuses: CollegeCampus[] = [];
  showCollegeCampus: boolean = false;
  adminRoleId: string = ''; // We'll set this in ngOnInit
  currentUserCollegeCampusID: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private roleService: RoleService,
    private collegeCampusService: CollegeCampusService,
    private authService: AuthService // Add this
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
      DepartmentID: [{ value: '', disabled: true }],
      CollegeCampusID: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadRoles();
    this.loadCollegeCampuses();

    this.newAccountForm.get('Roles')?.valueChanges.subscribe((selectedRoles: string[]) => {
      this.handleRoleSelection(selectedRoles);
    });

    this.getCurrentUserCollegeCampus();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: roles => {
        this.roles = roles;
        // Find the admin role and store its ID
        const adminRole = roles.find(role => role.RoleName.toLowerCase() === 'admin');
        if (adminRole) {
          this.adminRoleId = adminRole.RoleID.toString();
        }
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

  loadCollegeCampuses(): void {
    this.collegeCampusService.getCollegeCampuses().subscribe({
      next: campuses => this.collegeCampuses = campuses,
      error: error => console.error('Error fetching college campuses', error)
    });
  }

  // Handle role selection logic
  handleRoleSelection(selectedRoles: string[]): void {
    const departmentControl = this.newAccountForm.get('DepartmentID');
    const collegeCampusControl = this.newAccountForm.get('CollegeCampusID');

    const isStaffSelected = selectedRoles.includes(this.roles.find(r => r.RoleName.toLowerCase() === 'staff')?.RoleID?.toString() || '');
    const isAdminSelected = selectedRoles.includes(this.adminRoleId);

    if (isStaffSelected) {
      departmentControl?.disable();
      departmentControl?.setValue('');
    } else {
      departmentControl?.enable();
    }

    if (isAdminSelected) {
      this.showCollegeCampus = true;
      collegeCampusControl?.enable();
      collegeCampusControl?.setValidators(Validators.required);
    } else {
      this.showCollegeCampus = false;
      collegeCampusControl?.disable();
      collegeCampusControl?.clearValidators();
      collegeCampusControl?.setValue('');
    }

    collegeCampusControl?.updateValueAndValidity();
  }

  // Update selected roles when checkbox changes
  onRoleCheckboxChange(event: any): void {
    const selectedRoles = this.newAccountForm.get('Roles')?.value || [];
    const roleValue = event.target.value;

    if (event.target.checked) {
      selectedRoles.push(roleValue);
    } else {
      const index = selectedRoles.indexOf(roleValue);
      if (index > -1) {
        selectedRoles.splice(index, 1);
      }
    }
    this.newAccountForm.get('Roles')?.setValue(selectedRoles);
    this.handleRoleSelection(selectedRoles);
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

      // Handle DepartmentID
      if (formData.Roles.includes(this.roles.find(r => r.RoleName.toLowerCase() === 'staff')?.RoleID)) {
        formData.DepartmentID = null;
      }

      // Handle CollegeCampusID
      if (!formData.Roles.includes(this.adminRoleId)) {
        formData.CollegeCampusID = this.currentUserCollegeCampusID;
      }

      this.userService.addUser(formData).subscribe({
        next: response => {
          this.showToast('success', 'Account created successfully');
          this.newAccountForm.reset();
          this.newAccountForm.markAsPristine();
        },
        error: error => {
          console.log("Backend error details:", error);
          this.showToast('error', 'Error creating account');
        }
      });
    }
  }

  getCurrentUserCollegeCampus(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken && decodedToken.userId) {
      this.userService.getUserById(decodedToken.userId).subscribe({
        next: (user) => {
          this.currentUserCollegeCampusID = user.CollegeCampusID;
        },
        error: (error) => console.error('Error fetching current user details:', error)
      });
    }
  }
}

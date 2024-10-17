import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CollegeCampusService } from '../../services/college-campus.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CollegeCampus } from '../../model/college-campus.model';
import { CampusContextService } from '../../services/campus-context.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SettingsComponent implements OnInit {
  changePasswordForm: FormGroup;
  campusForm: FormGroup;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  campuses: CollegeCampus[] = [];
  userID: number;
  userRole: string = '';

  @Output() campusChanged = new EventEmitter<number>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private collegeCampusService: CollegeCampusService,
    private campusContextService: CampusContextService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });

    this.campusForm = this.fb.group({
      selectedCampus: ['', Validators.required]
    });

    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userID = decoded.userId;
    } else {
      this.userID = 0;
    }
    console.log('SettingsComponent initialized. UserID:', this.userID);
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.determineUserRole();
    this.loadCollegeCampuses();
    this.loadCurrentCampus();

    // Subscribe to campus changes
    this.campusContextService.getCampusId().subscribe(campusId => {
      if (campusId) {
        this.campusForm.patchValue({ selectedCampus: campusId });
      }
    });
  }

  determineUserRole(): void {
    const roles = this.authService.getUserRoles();
    if (roles.includes('admin')) {
      this.userRole = 'admin';
    } else if (roles.includes('superadmin')) {
      this.userRole = 'superadmin';
    } else {
      this.userRole = 'user';
    }
    console.log('User role:', this.userRole);
  }

  loadCollegeCampuses() {
    this.collegeCampusService.getCollegeCampuses().subscribe(
      campuses => {
        console.log('College campuses loaded:', campuses);
        this.campuses = campuses;
      },
      error => {
        console.error('Error loading college campuses:', error);
        this.showToastNotification('Failed to load college campuses. Please try again.', 'error');
      }
    );
  }

  loadCurrentCampus() {
    const currentCampusId = this.campusContextService.getCurrentCampusId();
    if (currentCampusId) {
      this.campusForm.patchValue({ selectedCampus: currentCampusId });
    } else {
      console.log('Loading current campus for userID:', this.userID);
      if (this.userID) {
        this.userService.getCurrentUserCampus(this.userID).subscribe(
          campus => {
            console.log('Current campus loaded:', campus);
            this.campusForm.patchValue({ selectedCampus: campus.CollegeCampusID });
            this.campusContextService.setCampusId(campus.CollegeCampusID);
          },
          error => {
            console.error('Error loading current campus:', error);
            this.showToastNotification('Failed to load current campus. Please try again.', 'error');
          }
        );
      } else {
        console.error('User ID not available');
        this.showToastNotification('User not authenticated. Please log in.', 'error');
      }
    }
  }

  onCampusChange(): void {
    const selectedCampusId = this.campusForm.get('selectedCampus')?.value;
    if (selectedCampusId) {
      this.campusContextService.setCampusId(selectedCampusId);
      console.log('Campus changed to:', selectedCampusId);
      this.showToastNotification('Campus selection updated!', 'success');
    }
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value !== confirmPassword.value ? { 'mustMatch': true } : null;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.showToastNotification('Password changed successfully!', 'success');
        },
        error: () => {
          this.showToastNotification('Failed to change password. Please try again.', 'error');
        }
      });
    } else {
      this.showToastNotification('Please correct the errors before submitting.', 'warning');
    }
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hide toast after 3 seconds
  }

  // You might want to add a method to check if the campus selection should be visible
  showCampusSelection(): boolean {
    return this.userRole === 'admin' || this.userRole === 'superadmin';
  }
}

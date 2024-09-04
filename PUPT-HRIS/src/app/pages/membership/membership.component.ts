import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfficershipMembershipService } from '../../services/officership-membership.service';
import { OfficershipMembership } from '../../model/officership-membership.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-officership-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class OfficershipMembershipComponent implements OnInit {
  membershipForm: FormGroup;
  memberships: OfficershipMembership[] = [];
  isEditing: boolean = false;
  currentMembershipId: number | null = null;
  userId: number;
  selectedFileName: string | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private membershipService: OfficershipMembershipService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.membershipForm = this.fb.group({
      OrganizationName: [''],
      OrganizationAddress: [''],
      Position: [''],
      Level: [''],
      Classification: [''],
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      Remarks: [''],
      SupportingDocument: [''],
      Proof: ['']
    });
  }

  ngOnInit(): void {
    this.loadMemberships();
  }

  loadMemberships(): void {
    this.membershipService.getOfficershipMembershipsByUserId(this.userId).subscribe(
      data => {
        this.memberships = data;
      },
      error => {
        this.showToastNotification('Error fetching memberships.', 'error');
        console.error('Error fetching memberships', error);
      }
    );
  }

  resetForm(showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges()) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    this.membershipForm.reset();
    this.currentMembershipId = null;
    this.isEditing = false;
  }

  onSubmit(): void {
    const membership = { ...this.membershipForm.value, UserID: this.userId };
    if (this.currentMembershipId) {
      this.membershipService.updateOfficershipMembership(this.currentMembershipId, membership).subscribe(
        response => {
          this.loadMemberships();
          this.resetForm();
          this.showToastNotification('Membership updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating membership', error);
        }
      );
    } else {
      this.membershipService.addOfficershipMembership(membership).subscribe(
        response => {
          this.loadMemberships();
          this.resetForm();
          this.showToastNotification('Membership added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding membership', error);
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  editMembership(id: number): void {
    const membership = this.memberships.find(m => m.OfficershipMembershipID === id);
    if (membership) {
      this.membershipForm.patchValue(membership);
      this.currentMembershipId = id;
      this.isEditing = true;
    }
  }

  deleteMembership(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.membershipService.deleteOfficershipMembership(id).subscribe(
        response => {
          this.memberships = this.memberships.filter(m => m.OfficershipMembershipID !== id);
          this.showToastNotification('Membership deleted successfully.', 'error');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting membership', error);
        }
      );
    }
  }

  addNewMembership(): void {
    this.resetForm(false);
    this.isEditing = true;
  }

  private hasUnsavedChanges(): boolean {
    return JSON.stringify(this.membershipForm.value) !== JSON.stringify(this.membershipForm.getRawValue());
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfficershipMembershipService } from '../../services/officership-membership.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-officership-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OfficershipMembershipComponent implements OnInit {
  membershipForm: FormGroup;
  memberships: any[] = [];
  isEditing: boolean = false;
  currentMembershipId: number | null = null;
  userId: number;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  selectedProofUrl: string | null = null;
  selectedSupportingDocument: string | null = null;
  isModalOpen: boolean = false;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private membershipService: OfficershipMembershipService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
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
      Level: ['Local'],
      Classification: ['Learning and Development Interventions'],
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      Remarks: [''],
      SupportingDocument: [''],
      Proof: [''],
    });
  }

  ngOnInit(): void {
    this.loadMemberships();
  }

  loadMemberships(): void {
    this.membershipService.getMembershipsByUserId(this.userId).subscribe(
      (data) => {
        this.memberships = data;
      },
      (error) => {
        console.error('Error fetching memberships:', error);
      }
    );
  }

  openProofModal(proofUrl: string, supportingDocument?: string): void {
    console.log('Opening modal with proof URL:', proofUrl);
    this.selectedProofUrl = proofUrl;
    this.selectedSupportingDocument = supportingDocument || 'No description available';
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    console.log('Closing modal');
    this.selectedProofUrl = null;
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  }

  onImageError(): void {
    console.error('Failed to load image from URL:', this.selectedProofUrl);
    alert('Could not load the image. Please check if the URL is valid or contact support.');
  }

  resetForm(showToast: boolean = true): void {
    this.membershipForm.reset();
    this.currentMembershipId = null;
    this.isEditing = false;
    this.selectedFile = null;
    this.selectedFileName = null;
    if (showToast) {
      this.showToastNotification('Form reset', 'warning');
    }
  }

  showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFileName = 'No file chosen';
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    const membershipData = { ...this.membershipForm.value, UserID: this.userId };
    const formData = new FormData();

    Object.keys(membershipData).forEach((key) => {
      formData.append(key, membershipData[key]);
    });

    if (this.selectedFile) {
      formData.append('proof', this.selectedFile);
    }

    if (this.currentMembershipId) {
      this.membershipService.updateMembership(this.currentMembershipId, formData).subscribe(
        (response) => {
          this.loadMemberships();
          this.resetForm();
          this.showToastNotification('Membership updated successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
        }
      );
    } else {
      this.membershipService.addMembership(formData).subscribe(
        (response) => {
          this.loadMemberships();
          this.resetForm();
          this.showToastNotification('Membership added successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
        }
      );
    }
  }

  editMembership(id: number): void {
    const membership = this.memberships.find(
      (m) => m.OfficershipMembershipID === id
    );
    if (membership) {
      this.membershipForm.patchValue(membership);
      this.currentMembershipId = id;
      this.isEditing = true;
    }
  }

  deleteMembership(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.membershipService.deleteMembership(id).subscribe(
        (response) => {
          this.memberships = this.memberships.filter(
            (m) => m.OfficershipMembershipID !== id
          );
          this.showToastNotification('Membership deleted successfully.', 'error');
        },
        (error) => {
          this.showToastNotification('There is an error deleting the record.', 'error');
        }
      );
    }
  }

  addNewMembership(): void {
    this.resetForm(false);
    this.isEditing = true;
  }
}

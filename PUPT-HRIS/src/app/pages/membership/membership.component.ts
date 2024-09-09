import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfficershipMembershipService } from '../../services/officership-membership.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

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
  paginatedMemberships: any[] = [];
  isEditing: boolean = false;
  currentMembershipId: number | null = null;
  userId: number;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  selectedProofUrl: string | null = null;
  selectedSupportingDocument: string | null = null;
  isModalOpen: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

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
        this.totalPages = Math.ceil(this.memberships.length / this.itemsPerPage);
        this.updatePaginatedData();
      },
      (error) => {
        console.error('Error fetching memberships:', error);
      }
    );
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMemberships = this.memberships.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  openProofModal(proofUrl: string, supportingDocument?: string): void {
    this.selectedProofUrl = proofUrl;
    this.selectedSupportingDocument = supportingDocument || 'No description available';
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.selectedProofUrl = null;
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  }

  onImageError(): void {
    alert('Failed to load image. Please check the URL.');
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
    const membership = this.memberships.find((m) => m.OfficershipMembershipID === id);
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
          this.showToastNotification('Membership deleted successfully.', 'success');
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

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfficershipMembershipService } from '../../services/officership-membership.service';
import { AuthService } from '../../services/auth.service';
import { ExcelImportService } from '../../services/excel-import.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { OfficershipMembership } from '../../model/officership-membership.model';

@Component({
  selector: 'app-officership-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OfficershipMembershipComponent implements OnInit {
  membershipForm: FormGroup;
  memberships: OfficershipMembership[] = [];
  paginatedMemberships: OfficershipMembership[] = [];
  isEditing: boolean = false;
  currentMembershipId: number | null = null;
  userId: number;
  fileToUpload: File | null = null;
  selectedFileName: string | null = null;
  selectedProofUrl: string | null = null;
  selectedSupportingDocument: string | null = null;
  selectedProofType: 'file' | 'link' | null = null;
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
    private excelImportService: ExcelImportService,
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
      ProofType: ['file']
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
        if (error.status !== 404) {
          this.showToastNotification('Error fetching officership/membership data.', 'error');
        }
        console.error('Error fetching officership/membership data', error);
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

  addNewMembership(): void {
    this.resetForm(false);
    this.isEditing = true;
  }

  editMembership(id: number): void {
    const membership = this.memberships.find(m => m.OfficershipMembershipID === id);
    if (membership) {
      this.isEditing = true;
      this.currentMembershipId = id;
      this.membershipForm.patchValue(membership);
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    Object.keys(this.membershipForm.value).forEach((key) => {
      if (key !== 'Proof' || this.membershipForm.get('ProofType')?.value === 'link') {
        formData.append(key, this.membershipForm.get(key)?.value || '');
      }
    });

    formData.append('UserID', this.userId.toString());

    if (this.membershipForm.get('ProofType')?.value === 'file' && this.fileToUpload) {
      formData.append('proof', this.fileToUpload);
    }

    if (this.currentMembershipId) {
      this.membershipService.updateMembership(this.currentMembershipId, formData).subscribe(
        (response) => {
          this.loadMemberships();
          this.resetForm();
          this.showToastNotification('Officership/Membership updated successfully.', 'success');
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
          this.showToastNotification('Officership/Membership added successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
        }
      );
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.selectedFileName = file.name;
    }
  }

  deleteMembership(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.membershipService.deleteMembership(id).subscribe(
        (response) => {
          // Remove the deleted item from the main array
          this.memberships = this.memberships.filter(membership => membership.OfficershipMembershipID !== id);
          
          // Recalculate total pages
          this.totalPages = Math.ceil(this.memberships.length / this.itemsPerPage);
          
          // Adjust current page if necessary
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
          
          // Update paginated data
          this.updatePaginatedData();
          
          this.showToastNotification('Officership/Membership deleted successfully.', 'success');
        },
        (error) => {
          this.showToastNotification('Error deleting officership/membership.', 'error');
          console.error('Error deleting officership/membership', error);
        }
      );
    }
  }

  openProofModal(proofUrl: string, supportingDocument?: string, proofType?: 'file' | 'link'): void {
    this.selectedProofUrl = proofUrl;
    this.selectedSupportingDocument = supportingDocument || 'No description available';
    this.selectedProofType = proofType || 'file';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.selectedProofUrl = null;
    this.isModalOpen = false;
  }

  resetForm(showToast: boolean = true): void {
    this.membershipForm.reset();
    this.fileToUpload = null;
    this.selectedFileName = null;
    this.currentMembershipId = null;
    this.isEditing = false;
    if (showToast) {
      this.showToastNotification('Form reset', 'warning');
    }
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  }

  onImageError(): void {
    alert('Failed to load image. Please check the URL.');
  }

  showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  importExcelData(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.excelImportService.importExcelData(file, this.userId).subscribe(
        (response) => {
          this.loadMemberships();
          this.showToastNotification('Data imported successfully', 'success');
        },
        (error) => {
          this.showToastNotification('Error importing data', 'error');
          console.error('Error importing data', error);
        }
      );
    }
  }
}

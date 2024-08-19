import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharacterReferenceService } from '../../services/character-reference.service';
import { CharacterReference } from '../../model/character-reference.model';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReferenceComponent implements OnInit {
  referenceForm: FormGroup;
  referenceData: CharacterReference[] = [];
  currentReferenceId: number | null = null;
  isEditing: boolean = false;
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private characterReferenceService: CharacterReferenceService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.referenceForm = this.fb.group({
      Name: ['', Validators.required],
      Address: [''],
      TelephoneNumber: [''],
    });
  }

  ngOnInit(): void {
    this.getReferences();
  }

  getReferences(): void {
    this.characterReferenceService.getReferences(this.userId).subscribe(
      (references) => {
        this.referenceData = references;
      },
      (error) => this.showToastNotification('Error fetching references.', 'error')
    );
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    if (this.referenceForm.valid) {
      const reference: CharacterReference = {
        ...this.referenceForm.value,
        UserID: this.userId
      };

      if (this.currentReferenceId) {
        this.characterReferenceService.updateReference(this.currentReferenceId, reference).subscribe(
          (updatedReference: CharacterReference) => {
            this.getReferences();
            this.resetForm();
            this.showToastNotification('Reference updated successfully.', 'success');
          },
          (error: any) => this.showToastNotification('Error updating reference.', 'error')
        );
      } else {
        if (this.referenceData.length < 3) {
          this.characterReferenceService.addReference(reference).subscribe(
            (newReference: CharacterReference) => {
              this.getReferences();
              this.resetForm();
              this.showToastNotification('Reference added successfully.', 'success');
            },
            (error: any) => this.showToastNotification('Error adding reference.', 'error')
          );
        } else {
          this.showToastNotification('You can only add up to 3 references.', 'warning');
        }
      }
    } else {
      this.showToastNotification('Form is invalid.', 'error');
    }
  }

  edit(referenceId: number): void {
    this.currentReferenceId = referenceId;
    const reference = this.referenceData.find(ref => ref.ReferenceID === referenceId);
    if (reference) {
      this.referenceForm.patchValue(reference);
      this.isEditing = true;
      this.initialFormValue = this.referenceForm.getRawValue(); // Store the initial form value
    }
  }

  delete(referenceId: number | undefined): void {
    if (referenceId !== undefined) {
      this.characterReferenceService.deleteReference(referenceId).subscribe(
        (response) => {
          this.getReferences();
          this.showToastNotification('Reference deleted successfully.', 'error');
        },
        (error) => this.showToastNotification('Error deleting reference.', 'error')
      );
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;
    this.referenceForm.reset();
    this.currentReferenceId = null;
  }

  resetForm(showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges()) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    this.referenceForm.reset();
    this.currentReferenceId = null;
    this.isEditing = false;
    this.initialFormValue = this.referenceForm.getRawValue(); // Store the initial form value for new form
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.referenceForm.getRawValue();
    return JSON.stringify(currentFormValue) !== JSON.stringify(this.initialFormValue);
  }

  private showToastNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hide toast after 3 seconds
  }
}

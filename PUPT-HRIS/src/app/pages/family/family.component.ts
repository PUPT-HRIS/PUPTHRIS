import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FamilyService } from '../../services/family.service';
import { FamilyBackground } from '../../model/family-background.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ChildrenComponent } from "../children/children.component";

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ChildrenComponent]
})
export class FamilyComponent implements OnInit {
  familyForm: FormGroup;
  familyData: FamilyBackground | null = null;
  isEditing: boolean = false;
  userId: number;
  initialFormValue: any; // To store the initial form value

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private familyService: FamilyService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.familyForm = this.fb.group({
      SpouseLastName: [''],
      SpouseFirstName: [''],
      SpouseMiddleName: [''],
      SpouseOccupation: [''],
      SpouseEmployerName: [''],
      SpouseBusinessAddress: [''],
      SpouseTelephoneNumber: [''],
      FatherLastName: [''],
      FatherFirstName: [''],
      FatherMiddleName: [''],
      MotherLastName: [''],
      MotherFirstName: [''],
      MotherMiddleName: ['']
    });
  }

  ngOnInit(): void {
    this.loadFamilyBackground();
  }

  loadFamilyBackground(): void {
    this.familyService.getFamilyBackground(this.userId).subscribe(
      data => {
        this.familyData = data;
        if (this.familyData) {
          this.familyForm.patchValue(this.familyData);
          this.initialFormValue = this.familyForm.getRawValue(); // Store the initial form value
        }
      },
      error => {
        this.showToastNotification('Error fetching family background.', 'error');
        console.error('Error fetching family background', error);
      }
    );
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initialFormValue = this.familyForm.getRawValue(); // Store the initial form value
    } else {
      if (this.hasUnsavedChanges()) { // Check for unsaved changes before canceling
        this.showToastNotification('The changes are not saved.', 'error');
      }
      this.familyForm.patchValue(this.familyData || {});
    }
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const familyBackground = { ...this.familyForm.value, UserID: this.userId };

    if (this.familyData) {
      this.familyService.updateFamilyBackground(this.familyData.FamilyBackgroundID!, familyBackground).subscribe(
        response => {
          this.loadFamilyBackground();
          this.isEditing = false;
          this.showToastNotification('Information updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating family background', error);
        }
      );
    } else {
      this.familyService.addFamilyBackground(familyBackground).subscribe(
        response => {
          this.loadFamilyBackground();
          this.isEditing = false;
          this.showToastNotification('Family background added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding family background', error);
        }
      );
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.familyForm.getRawValue();
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

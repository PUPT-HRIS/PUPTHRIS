import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CivilServiceEligibility } from '../../model/civil-service.model';
import { CivilServiceService } from '../../services/civil.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-civil',
  templateUrl: './civil.component.html',
  styleUrls: ['./civil.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CivilComponent implements OnInit {
  civilServiceForm: FormGroup;
  civilServiceData: CivilServiceEligibility[] = [];
  isEditing: boolean = false;
  currentEligibilityId: number | null = null;

  constructor(private fb: FormBuilder, private civilServiceService: CivilServiceService) {
    this.civilServiceForm = this.fb.group({
      CareerService: [''],
      Rating: [''],
      DateOfExamination: [''],
      PlaceOfExamination: [''],
      LicenseNumber: [''],
      LicenseValidityDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadCivilServiceEligibilities();
  }

  loadCivilServiceEligibilities(): void {
    this.civilServiceService.getCivilServiceEligibilities().subscribe(
      data => {
        this.civilServiceData = data;
      },
      error => {
        console.error('Error fetching civil service eligibilities', error);
      }
    );
  }

  resetForm(): void {
    this.civilServiceForm.reset();
    this.currentEligibilityId = null;
    this.isEditing = false;
  }

  onSubmit(): void {
    const formData = { ...this.civilServiceForm.value };
    if (this.currentEligibilityId) {
      this.civilServiceService.updateCivilServiceEligibility(this.currentEligibilityId, formData).subscribe(
        response => {
          console.log('Civil service eligibility updated successfully', response);
          this.loadCivilServiceEligibilities();
          this.resetForm();
        },
        error => {
          console.error('Error updating civil service eligibility', error);
        }
      );
    } else {
      this.civilServiceService.addCivilServiceEligibility(formData).subscribe(
        response => {
          console.log('Civil service eligibility added successfully', response);
          this.loadCivilServiceEligibilities();
          this.resetForm();
        },
        error => {
          console.error('Error adding civil service eligibility', error);
        }
      );
    }
  }

  editEligibility(id: number): void {
    const eligibility = this.civilServiceData.find(el => el.CivilServiceEligibilityID === id);
    if (eligibility) {
      this.civilServiceForm.patchValue(eligibility);
      this.currentEligibilityId = id;
      this.isEditing = true;
    }
  }

  deleteEligibility(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.civilServiceService.deleteCivilServiceEligibility(id).subscribe(
        response => {
          console.log('Civil service eligibility deleted successfully', response);
          this.loadCivilServiceEligibilities();
        },
        error => {
          console.error('Error deleting civil service eligibility', error);
        }
      );
    }
  }

  addNewEligibility(): void {
    this.resetForm();
    this.isEditing = true;
  }
}

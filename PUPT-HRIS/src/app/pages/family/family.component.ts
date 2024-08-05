import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FamilyService } from '../../services/family.service';
import { FamilyBackground } from '../../model/family-background.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class FamilyComponent implements OnInit {
  familyForm: FormGroup;
  familyData: FamilyBackground | null = null;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private familyService: FamilyService) {
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
    const employeeId = 2; // Replace with actual employee ID
    this.familyService.getFamilyBackground(employeeId).subscribe(
      data => {
        this.familyData = data;
        if (this.familyData) {
          this.familyForm.patchValue(this.familyData);
        }
      },
      error => {
        console.error('Error fetching family background', error);
      }
    );
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    if (this.familyData) {
      this.familyService.updateFamilyBackground(this.familyData.FamilyBackgroundID!, this.familyForm.value).subscribe(
        response => {
          console.log('Family background updated successfully', response);
          this.loadFamilyBackground();
          this.isEditing = false;
        },
        error => {
          console.error('Error updating family background', error);
        }
      );
    } else {
      this.familyService.addFamilyBackground(this.familyForm.value).subscribe(
        response => {
          console.log('Family background added successfully', response);
          this.loadFamilyBackground();
          this.isEditing = false;
        },
        error => {
          console.error('Error adding family background', error);
        }
      );
    }
  }
}

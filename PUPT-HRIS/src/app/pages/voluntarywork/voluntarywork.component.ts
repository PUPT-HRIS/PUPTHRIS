import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VoluntaryWorkService } from '../../services/voluntarywork.service';
import { VoluntaryWork } from '../../model/voluntary-work.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-voluntarywork',
  templateUrl: './voluntarywork.component.html',
  styleUrls: ['./voluntarywork.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class VoluntaryWorkComponent implements OnInit {
  voluntaryWorkForm: FormGroup;
  voluntaryWorkData: VoluntaryWork[] = [];
  isEditing: boolean = false;
  currentVoluntaryWorkId: number | null = null;
  employeeId: number;

  constructor(
    private fb: FormBuilder,
    private voluntaryWorkService: VoluntaryWorkService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.employeeId = decoded.userId;
    } else {
      this.employeeId = 0;
    }

    this.voluntaryWorkForm = this.fb.group({
      OrganizationNameAddress: [''],
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      NumberOfHours: [''],
      PositionNatureOfWork: ['']
    });
  }

  ngOnInit(): void {
    this.loadVoluntaryWorks();
  }

  loadVoluntaryWorks(): void {
    this.voluntaryWorkService.getVoluntaryWorks(this.employeeId).subscribe(
      data => {
        this.voluntaryWorkData = data;
      },
      error => {
        console.error('Error fetching voluntary works', error);
      }
    );
  }

  resetForm(): void {
    this.voluntaryWorkForm.reset();
    this.currentVoluntaryWorkId = null;
    this.isEditing = false;
  }

  onSubmit(): void {
    const formData = { ...this.voluntaryWorkForm.value, EmployeeID: this.employeeId };
    if (this.currentVoluntaryWorkId) {
      this.voluntaryWorkService.updateVoluntaryWork(this.currentVoluntaryWorkId, formData).subscribe(
        response => {
          console.log('Voluntary work updated successfully', response);
          this.loadVoluntaryWorks();
          this.resetForm();
        },
        error => {
          console.error('Error updating voluntary work', error);
        }
      );
    } else {
      this.voluntaryWorkService.addVoluntaryWork(formData).subscribe(
        response => {
          console.log('Voluntary work added successfully', response);
          this.loadVoluntaryWorks();
          this.resetForm();
        },
        error => {
          console.error('Error adding voluntary work', error);
        }
      );
    }
  }

  editVoluntaryWork(id: number): void {
    const voluntaryWork = this.voluntaryWorkData.find(vw => vw.VoluntaryWorkID === id);
    if (voluntaryWork) {
      this.voluntaryWorkForm.patchValue(voluntaryWork);
      this.currentVoluntaryWorkId = id;
      this.isEditing = true;
    }
  }

  deleteVoluntaryWork(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.voluntaryWorkService.deleteVoluntaryWork(id).subscribe(
        response => {
          console.log('Voluntary work deleted successfully', response);
          this.loadVoluntaryWorks();
        },
        error => {
          console.error('Error deleting voluntary work', error);
        }
      );
    }
  }

  addNewVoluntaryWork(): void {
    this.resetForm();
    this.isEditing = true;
  }
}

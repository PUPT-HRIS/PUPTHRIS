import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LearningService } from '../../services/learning.service';
import { LearningDevelopment } from '../../model/learning-development.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LearningComponent implements OnInit {
  learningForm: FormGroup;
  learningData: LearningDevelopment[] = [];
  isEditing: boolean = false;
  currentLearningId: number | null = null;
  userId: number;

  constructor(private fb: FormBuilder, private learningService: LearningService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.learningForm = this.fb.group({
      TitleOfLearningDevelopment: [''],
      InclusiveDatesFrom: [''],
      InclusiveDatesTo: [''],
      NumberOfHours: [''],
      TypeOfLD: [''],
      ConductedSponsoredBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadLearningDevelopments();
  }

  loadLearningDevelopments(): void {
    this.learningService.getLearningDevelopments(this.userId).subscribe(
      data => {
        this.learningData = data;
      },
      error => {
        console.error('Error fetching learning developments', error);
      }
    );
  }

  resetForm(): void {
    this.learningForm.reset();
    this.currentLearningId = null;
    this.isEditing = false;
  }

  onSubmit(): void {
    const formData = { ...this.learningForm.value, UserID: this.userId };
    if (this.currentLearningId) {
      this.learningService.updateLearningDevelopment(this.currentLearningId, formData).subscribe(
        response => {
          console.log('Learning development updated successfully', response);
          this.loadLearningDevelopments();
          this.resetForm();
        },
        error => {
          console.error('Error updating learning development', error);
        }
      );
    } else {
      this.learningService.addLearningDevelopment(formData).subscribe(
        response => {
          console.log('Learning development added successfully', response);
          this.loadLearningDevelopments();
          this.resetForm();
        },
        error => {
          console.error('Error adding learning development', error);
        }
      );
    }
  }

  editLearning(id: number): void {
    const learning = this.learningData.find(ld => ld.LearningDevelopmentID === id);
    if (learning) {
      this.learningForm.patchValue(learning);
      this.currentLearningId = id;
      this.isEditing = true;
    }
  }

  deleteLearning(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.learningService.deleteLearningDevelopment(id).subscribe(
        response => {
          console.log('Learning development deleted successfully', response);
          this.learningData = this.learningData.filter(ld => ld.LearningDevelopmentID !== id);
        },
        error => {
          console.error('Error deleting learning development', error);
        }
      );
    }
  }

  addNewLearning(): void {
    this.resetForm();
    this.isEditing = true;
  }
}

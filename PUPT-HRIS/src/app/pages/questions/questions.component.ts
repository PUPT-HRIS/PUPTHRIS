import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdditionalQuestionService } from '../../services/additional-question.service';
import { AuthService } from '../../services/auth.service';
import { AdditionalQuestion } from '../../model/additional-question.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class QuestionsComponent implements OnInit {
  questionsForm: FormGroup;
  userId: number;
  showToast: boolean = false;
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private additionalQuestionService: AdditionalQuestionService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.questionsForm = this.fb.group({
      Q34a: ['', Validators.required],
      Q34a_Details: [''],
      Q34b: ['', Validators.required],
      Q34b_Details: [''],
      Q35a: ['', Validators.required],
      Q35a_Details: [''],
      Q35b: ['', Validators.required],
      Q35b_Details: [''],
      Q35b_DateFiled: [''],
      Q35b_Status: [''],
      Q36: ['', Validators.required],
      Q36_Details: [''],
      Q37a: ['', Validators.required],
      Q37a_Details: [''],
      Q37b: ['', Validators.required],
      Q37b_Details: [''],
      Q37c: ['', Validators.required],
      Q37c_Details: [''],
      Q38: ['', Validators.required],
      Q38_Details: [''],
      Q39a: ['', Validators.required],
      Q39a_Details: [''],
      Q39b: ['', Validators.required],
      Q39b_Details: [''],
      Q40a: ['', Validators.required],
      Q40a_Details: [''],
      Q40b: ['', Validators.required], 
      Q40b_Details: [''],
      Q40b_ID: [''],
      Q40c: ['', Validators.required], 
      Q40c_Details: [''],
      Q40c_ID: [''],
    });
  }

  ngOnInit(): void {
    this.loadAdditionalQuestion();
  }

  loadAdditionalQuestion(): void {
    this.additionalQuestionService.getAdditionalQuestion(this.userId).subscribe(
      (data) => {
        if (data) {
          this.questionsForm.patchValue(data);
        }
      },
      (error) => {
        console.error('Error fetching additional questions', error);
      }
    );
  }

  onSubmit(): void {
    if (this.questionsForm.valid) {
      const additionalQuestion: AdditionalQuestion = {
        ...this.questionsForm.value,
        UserID: this.userId,
      };

      if (this.questionsForm.dirty) {
        this.additionalQuestionService.addOrUpdateAdditionalQuestion(additionalQuestion).subscribe(
          (response) => {
            this.triggerToast('success', 'Additional questions saved successfully');
            this.questionsForm.markAsPristine();
          },
          (error) => {
            this.triggerToast('error', 'Error saving additional questions');
            console.error('Error saving additional questions', error);
          }
        );
      } else {
        this.triggerToast('warning', 'No changes detected');
      }
    } else {
      this.triggerToast('error', 'Form is invalid');
      console.error('Form is invalid');
    }
  }

  triggerToast(type: 'success' | 'error' | 'warning', message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

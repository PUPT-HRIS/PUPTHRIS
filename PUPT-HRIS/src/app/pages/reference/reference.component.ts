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
      (error) => console.error('Error fetching references:', error)
    );
  }

  onSubmit(): void {
    if (this.referenceForm.valid) {
      const reference: CharacterReference = {
        ...this.referenceForm.value,
        UserID: this.userId
      };

      if (this.currentReferenceId) {
        this.characterReferenceService.updateReference(this.currentReferenceId, reference).subscribe(
          (updatedReference: CharacterReference) => {
            this.getReferences();
            this.isEditing = false;
          },
          (error: any) => console.error('Error updating reference:', error)
        );
      } else {
        if (this.referenceData.length < 3) {
          this.characterReferenceService.addReference(reference).subscribe(
            (newReference: CharacterReference) => {
              this.getReferences();
              this.isEditing = false;
            },
            (error: any) => console.error('Error adding reference:', error)
          );
        } else {
          alert('You can only add up to 3 references.');
        }
      }
    } else {
      console.log('Form is invalid');
    }
  }

  edit(referenceId: number): void {
    this.currentReferenceId = referenceId;
    const reference = this.referenceData.find(ref => ref.ReferenceID === referenceId);
    if (reference) {
      this.referenceForm.patchValue(reference);
      this.isEditing = true;
    }
  }

  delete(referenceId: number | undefined): void {
    if (referenceId !== undefined) {
      this.characterReferenceService.deleteReference(referenceId).subscribe(
        (response) => {
          console.log(response.message);
          this.getReferences();
        },
        (error) => console.error('Error deleting reference:', error)
      );
    }
  }
    
  cancelEdit(): void {
    this.isEditing = false;
    this.referenceForm.reset();
    this.currentReferenceId = null;
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;
    this.referenceForm.reset();
    this.currentReferenceId = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChildrenService } from '../../services/children.service';
import { Children } from '../../model/children.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ChildrenComponent implements OnInit {
  childrenForm: FormGroup;
  childrenData: Children[] = [];
  isEditing: boolean = false;
  currentChildId: number | null | undefined = null;
  userId: number;

  constructor(private fb: FormBuilder, private childrenService: ChildrenService, private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.childrenForm = this.fb.group({
      ChildName: [''],
      BirthDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren(): void {
    this.childrenService.getChildren(this.userId).subscribe(
      data => {
        this.childrenData = data;
      },
      error => {
        console.error('Error fetching children data', error);
      }
    );
  }

  editChild(child: Children): void {
    this.isEditing = true;
    this.currentChildId = child.ChildrenID;
    this.childrenForm.patchValue(child);
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;
    this.currentChildId = null;
    this.childrenForm.reset();
  }

  onSubmit(): void {
    if (this.currentChildId !== null && this.currentChildId !== undefined) {
      this.childrenService.updateChild(this.currentChildId, this.childrenForm.value).subscribe(
        response => {
          console.log('Child updated successfully', response);
          this.loadChildren();
          this.toggleForm();
        },
        error => {
          console.error('Error updating child', error);
        }
      );
    } else {
      const newChild = { ...this.childrenForm.value, UserID: this.userId };
      this.childrenService.addChild(newChild).subscribe(
        response => {
          console.log('Child added successfully', response);
          this.loadChildren();
          this.toggleForm();
        },
        error => {
          console.error('Error adding child', error);
        }
      );
    }
  }

  deleteChild(id: number): void {
    if (confirm('Are you sure you want to delete this child?')) {
      this.childrenService.deleteChild(id).subscribe(
        response => {
          console.log('Child deleted successfully', response);
          this.childrenData = this.childrenData.filter(child => child.ChildrenID !== id);
        },
        error => {
          console.error('Error deleting child', error);
        }
      );
    }
  }
}

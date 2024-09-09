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
  initialFormValue: any; // To store the initial form value

  currentPage = 1;
  totalPages = 0;
  pageSize = 5;
  pages: number[] = [];

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

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
        this.totalPages = Math.ceil(this.childrenData.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error => {
        this.showToastNotification('Error fetching children data.', 'error');
        console.error('Error fetching children data', error);
      }
    );
  }

  get paginatedChildrenData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.childrenData.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  editChild(child: Children): void {
    this.isEditing = true;
    this.currentChildId = child.ChildrenID;
    this.childrenForm.patchValue(child);
    this.initialFormValue = this.childrenForm.getRawValue(); // Store the initial form value
  }

  toggleForm(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.childrenForm.reset();
      this.currentChildId = null;
      this.initialFormValue = this.childrenForm.getRawValue(); // Store the initial form value for new form
    } else {
      if (this.hasUnsavedChanges()) { // Check for unsaved changes before canceling
        this.showToastNotification('The changes are not saved.', 'error');
      }
    }
  }

  onSubmit(): void {
    if (!this.hasUnsavedChanges()) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const childData = { ...this.childrenForm.value, UserID: this.userId };

    if (this.currentChildId !== null && this.currentChildId !== undefined) {
      this.childrenService.updateChild(this.currentChildId, childData).subscribe(
        response => {
          this.loadChildren();
          this.toggleForm();
          this.showToastNotification('Information updated successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error updating child', error);
        }
      );
    } else {
      this.childrenService.addChild(childData).subscribe(
        response => {
          this.loadChildren();
          this.toggleForm();
          this.showToastNotification('Child added successfully.', 'success');
        },
        error => {
          this.showToastNotification('There is an error saving/updating the changes.', 'error');
          console.error('Error adding child', error);
        }
      );
    }
  }

  deleteChild(id: number): void {
    if (confirm('Are you sure you want to delete this child?')) {
      this.childrenService.deleteChild(id).subscribe(
        response => {
          this.loadChildren();
          this.showToastNotification('Child record deleted successfully.', 'error');
        },
        error => {
          this.showToastNotification('There is an error deleting the record.', 'error');
          console.error('Error deleting child', error);
        }
      );
    }
  }

  private hasUnsavedChanges(): boolean {
    const currentFormValue = this.childrenForm.getRawValue();
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

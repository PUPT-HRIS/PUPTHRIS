import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialSkillService } from '../../services/special-skill.service';
import { NonAcademicService } from '../../services/non-academic.service';
import { MembershipService } from '../../services/membership.service';
import { SpecialSkill } from '../../model/specialskills.model';
import { NonAcademic } from '../../model/nonacademic.model';
import { Membership } from '../../model/membership.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otherinformation',
  templateUrl: './otherinformation.component.html',
  styleUrls: ['./otherinformation.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class OtherInformationComponent implements OnInit {
  specialSkillsForm: FormGroup;
  nonAcademicForm: FormGroup;
  membershipForm: FormGroup;

  specialSkillsData: SpecialSkill[] = [];
  nonAcademicData: NonAcademic[] = [];
  membershipData: Membership[] = [];

  isEditingSkill: boolean = false;
  isEditingDistinction: boolean = false;
  isEditingMembership: boolean = false;

  currentSkillId: number | null = null;
  currentDistinctionId: number | null = null;
  currentMembershipId: number | null = null;

  userId: number;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  initialFormValue: any;

  constructor(
    private fb: FormBuilder,
    private specialSkillService: SpecialSkillService,
    private nonAcademicService: NonAcademicService,
    private membershipService: MembershipService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    } else {
      this.userId = 0;
    }

    this.specialSkillsForm = this.fb.group({
      Skill: ['', Validators.required]
    });

    this.nonAcademicForm = this.fb.group({
      Distinction: ['', Validators.required]
    });

    this.membershipForm = this.fb.group({
      Association: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOtherInformation();
  }

  loadOtherInformation(): void {
    this.specialSkillService.getSpecialSkills(this.userId).subscribe(
      data => { this.specialSkillsData = data; },
      error => { this.showToastNotification('Error fetching special skills', 'error'); }
    );

    this.nonAcademicService.getNonAcademics(this.userId).subscribe(
      data => { this.nonAcademicData = data; },
      error => { this.showToastNotification('Error fetching distinctions', 'error'); }
    );

    this.membershipService.getMemberships(this.userId).subscribe(
      data => { this.membershipData = data; },
      error => { this.showToastNotification('Error fetching memberships', 'error'); }
    );
  }

  onSubmitSkill(): void {
    if (!this.hasUnsavedChanges(this.specialSkillsForm)) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const formData = { ...this.specialSkillsForm.value, UserID: this.userId };
    if (this.currentSkillId) {
      this.specialSkillService.updateSpecialSkill(this.currentSkillId, formData).subscribe(
        response => {
          this.showToastNotification('Special skill updated successfully', 'success');
          this.loadOtherInformation();
          this.resetSkillForm(false);
        },
        error => { this.showToastNotification('Error updating special skill', 'error'); }
      );
    } else {
      this.specialSkillService.addSpecialSkill(formData).subscribe(
        response => {
          this.showToastNotification('Special skill added successfully', 'success');
          this.loadOtherInformation();
          this.resetSkillForm(false);
        },
        error => { this.showToastNotification('Error adding special skill', 'error'); }
      );
    }
  }

  onSubmitDistinction(): void {
    if (!this.hasUnsavedChanges(this.nonAcademicForm)) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const formData = { ...this.nonAcademicForm.value, UserID: this.userId };
    if (this.currentDistinctionId) {
      this.nonAcademicService.updateNonAcademic(this.currentDistinctionId, formData).subscribe(
        response => {
          this.showToastNotification('Distinction updated successfully', 'success');
          this.loadOtherInformation();
          this.resetDistinctionForm(false);
        },
        error => { this.showToastNotification('Error updating distinction', 'error'); }
      );
    } else {
      this.nonAcademicService.addNonAcademic(formData).subscribe(
        response => {
          this.showToastNotification('Distinction added successfully', 'success');
          this.loadOtherInformation();
          this.resetDistinctionForm(false);
        },
        error => { this.showToastNotification('Error adding distinction', 'error'); }
      );
    }
  }

  onSubmitMembership(): void {
    if (!this.hasUnsavedChanges(this.membershipForm)) {
      this.showToastNotification('There are no current changes to be saved.', 'warning');
      return;
    }

    const formData = { ...this.membershipForm.value, UserID: this.userId };
    if (this.currentMembershipId) {
      this.membershipService.updateMembership(this.currentMembershipId, formData).subscribe(
        response => {
          this.showToastNotification('Membership updated successfully', 'success');
          this.loadOtherInformation();
          this.resetMembershipForm(false);
        },
        error => { this.showToastNotification('Error updating membership', 'error'); }
      );
    } else {
      this.membershipService.addMembership(formData).subscribe(
        response => {
          this.showToastNotification('Membership added successfully', 'success');
          this.loadOtherInformation();
          this.resetMembershipForm(false);
        },
        error => { this.showToastNotification('Error adding membership', 'error'); }
      );
    }
  }

  editSpecialSkill(id: number): void {
    const skill = this.specialSkillsData.find(ss => ss.SpecialSkillsID === id);
    if (skill) {
      this.specialSkillsForm.patchValue(skill);
      this.currentSkillId = id;
      this.isEditingSkill = true;
      this.initialFormValue = this.specialSkillsForm.getRawValue(); // Store the initial form value
    }
  }

  editDistinction(id: number): void {
    const distinction = this.nonAcademicData.find(nd => nd.NonAcademicID === id);
    if (distinction) {
      this.nonAcademicForm.patchValue(distinction);
      this.currentDistinctionId = id;
      this.isEditingDistinction = true;
      this.initialFormValue = this.nonAcademicForm.getRawValue(); // Store the initial form value
    }
  }

  editMembership(id: number): void {
    const membership = this.membershipData.find(ms => ms.MembershipID === id);
    if (membership) {
      this.membershipForm.patchValue(membership);
      this.currentMembershipId = id;
      this.isEditingMembership = true;
      this.initialFormValue = this.membershipForm.getRawValue(); // Store the initial form value
    }
  }

  deleteSpecialSkill(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.specialSkillService.deleteSpecialSkill(id).subscribe(
        response => {
          this.showToastNotification('Special skill deleted successfully', 'error');
          this.specialSkillsData = this.specialSkillsData.filter(skill => skill.SpecialSkillsID !== id);
        },
        error => { this.showToastNotification('Error deleting special skill', 'error'); }
      );
    }
  }

  deleteDistinction(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.nonAcademicService.deleteNonAcademic(id).subscribe(
        response => {
          this.showToastNotification('Distinction deleted successfully', 'error');
          this.nonAcademicData = this.nonAcademicData.filter(distinction => distinction.NonAcademicID !== id);
        },
        error => { this.showToastNotification('Error deleting distinction', 'error'); }
      );
    }
  }

  deleteMembership(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.membershipService.deleteMembership(id).subscribe(
        response => {
          this.showToastNotification('Membership deleted successfully', 'error');
          this.membershipData = this.membershipData.filter(membership => membership.MembershipID !== id);
        },
        error => { this.showToastNotification('Error deleting membership', 'error'); }
      );
    }
  }

  resetSkillForm(showToast: boolean = true): void {
    this.resetForm(this.specialSkillsForm, showToast);
    this.currentSkillId = null;
    this.isEditingSkill = false;
  }

  resetDistinctionForm(showToast: boolean = true): void {
    this.resetForm(this.nonAcademicForm, showToast);
    this.currentDistinctionId = null;
    this.isEditingDistinction = false;
  }

  resetMembershipForm(showToast: boolean = true): void {
    this.resetForm(this.membershipForm, showToast);
    this.currentMembershipId = null;
    this.isEditingMembership = false;
  }

  private resetForm(form: FormGroup, showToast: boolean = true): void {
    if (showToast && this.hasUnsavedChanges(form)) {
      this.showToastNotification('The changes are not saved.', 'error');
    }
    form.reset();
    this.initialFormValue = form.getRawValue(); // Store the initial form value for new form
  }

  private hasUnsavedChanges(form: FormGroup): boolean {
    const currentFormValue = form.getRawValue();
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

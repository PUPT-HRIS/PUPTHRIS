import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpecialSkillService } from '../../services/special-skill.service';
import { NonAcademicService } from '../../services/non-academic.service';
import { MembershipService } from '../../services/membership.service';
import { SpecialSkill } from '../../model/specialskills.model';
import { NonAcademic } from '../../model/nonacademic.model';
import { Membership } from '../../model/membership.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

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
      Skill: ['']
    });

    this.nonAcademicForm = this.fb.group({
      Distinction: ['']
    });

    this.membershipForm = this.fb.group({
      Association: ['']
    });
  }

  ngOnInit(): void {
    this.loadOtherInformation();
  }

  loadOtherInformation(): void {
    this.specialSkillService.getSpecialSkills(this.userId).subscribe(
      data => { this.specialSkillsData = data; },
      error => { console.error('Error fetching special skills', error); }
    );

    this.nonAcademicService.getNonAcademics(this.userId).subscribe(
      data => { this.nonAcademicData = data; },
      error => { console.error('Error fetching distinctions', error); }
    );

    this.membershipService.getMemberships(this.userId).subscribe(
      data => { this.membershipData = data; },
      error => { console.error('Error fetching memberships', error); }
    );
  }

  onSubmitSkill(): void {
    const formData = { ...this.specialSkillsForm.value, UserID: this.userId }; 
    if (this.currentSkillId) {
      this.specialSkillService.updateSpecialSkill(this.currentSkillId, formData).subscribe(
        response => {
          console.log('Special skill updated successfully', response);
          this.loadOtherInformation();
          this.resetSkillForm();
        },
        error => { console.error('Error updating special skill', error); }
      );
    } else {
      this.specialSkillService.addSpecialSkill(formData).subscribe(
        response => {
          console.log('Special skill added successfully', response);
          this.loadOtherInformation();
          this.resetSkillForm();
        },
        error => { console.error('Error adding special skill', error); }
      );
    }
  }

  onSubmitDistinction(): void {
    const formData = { ...this.nonAcademicForm.value, UserID: this.userId };
    if (this.currentDistinctionId) {
      this.nonAcademicService.updateNonAcademic(this.currentDistinctionId, formData).subscribe(
        response => {
          console.log('Distinction updated successfully', response);
          this.loadOtherInformation();
          this.resetDistinctionForm();
        },
        error => { console.error('Error updating distinction', error); }
      );
    } else {
      this.nonAcademicService.addNonAcademic(formData).subscribe(
        response => {
          console.log('Distinction added successfully', response);
          this.loadOtherInformation();
          this.resetDistinctionForm();
        },
        error => { console.error('Error adding distinction', error); }
      );
    }
  }

  onSubmitMembership(): void {
    const formData = { ...this.membershipForm.value, UserID: this.userId };
    if (this.currentMembershipId) {
      this.membershipService.updateMembership(this.currentMembershipId, formData).subscribe(
        response => {
          console.log('Membership updated successfully', response);
          this.loadOtherInformation();
          this.resetMembershipForm();
        },
        error => { console.error('Error updating membership', error); }
      );
    } else {
      this.membershipService.addMembership(formData).subscribe(
        response => {
          console.log('Membership added successfully', response);
          this.loadOtherInformation();
          this.resetMembershipForm();
        },
        error => { console.error('Error adding membership', error); }
      );
    }
  }

  editSpecialSkill(id: number): void {
    const skill = this.specialSkillsData.find(ss => ss.SpecialSkillsID === id);
    if (skill) {
      this.specialSkillsForm.patchValue(skill);
      this.currentSkillId = id;
      this.isEditingSkill = true;
    }
  }

  editDistinction(id: number): void {
    const distinction = this.nonAcademicData.find(nd => nd.NonAcademicID === id);
    if (distinction) {
      this.nonAcademicForm.patchValue(distinction);
      this.currentDistinctionId = id;
      this.isEditingDistinction = true;
    }
  }

  editMembership(id: number): void {
    const membership = this.membershipData.find(ms => ms.MembershipID === id);
    if (membership) {
      this.membershipForm.patchValue(membership);
      this.currentMembershipId = id;
      this.isEditingMembership = true;
    }
  }

  deleteSpecialSkill(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.specialSkillService.deleteSpecialSkill(id).subscribe(
        response => {
          console.log('Special skill deleted successfully', response);
          this.specialSkillsData = this.specialSkillsData.filter(skill => skill.SpecialSkillsID !== id);
        },
        error => { console.error('Error deleting special skill', error); }
      );
    }
  }  

  deleteDistinction(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.nonAcademicService.deleteNonAcademic(id).subscribe(
        response => {
          console.log('Distinction deleted successfully', response);
          this.nonAcademicData = this.nonAcademicData.filter(distinction => distinction.NonAcademicID !== id);
        },
        error => { console.error('Error deleting distinction', error); }
      );
    }
  }
  

  deleteMembership(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.membershipService.deleteMembership(id).subscribe(
        response => {
          console.log('Membership deleted successfully', response);
          this.membershipData = this.membershipData.filter(membership => membership.MembershipID !== id);
        },
        error => { console.error('Error deleting membership', error); }
      );
    }
  }
  
  resetSkillForm(): void {
    this.specialSkillsForm.reset();
    this.currentSkillId = null;
    this.isEditingSkill = false;
  }

  resetDistinctionForm(): void {
    this.nonAcademicForm.reset();
    this.currentDistinctionId = null;
    this.isEditingDistinction = false;
  }

  resetMembershipForm(): void {
    this.membershipForm.reset();
    this.currentMembershipId = null;
    this.isEditingMembership = false;
  }
}

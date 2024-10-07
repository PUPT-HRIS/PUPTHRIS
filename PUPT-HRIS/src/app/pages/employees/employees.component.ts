import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BasicDetailsService } from '../../services/basic-details.service';
import { EducationService } from '../../services/education.service';
import { PersonalDetailsService } from '../../services/personal-details.service';
import { ContactDetailsService } from '../../services/contact-details.service';
import { FamilyService } from '../../services/family.service';
import { ChildrenService } from '../../services/children.service';
import { CivilServiceService } from '../../services/civil.service';
import { LearningService } from '../../services/learning.service';
import { WorkService } from '../../services/work.service';
import { VoluntaryWorkService } from '../../services/voluntarywork.service';
import { CharacterReferenceService } from '../../services/character-reference.service';
import { User } from '../../model/user.model';
import { BasicDetails } from '../../model/basic-details.model';
import { Education } from '../../model/education.model';
import { PersonalDetails } from '../../model/personal-details.model';
import { ContactDetails } from '../../model/contact-details.model';
import { FamilyBackground } from '../../model/family-background.model';
import { Children } from '../../model/children.model';
import { CivilServiceEligibility } from '../../model/civil-service.model';
import { LearningDevelopment } from '../../model/learning-development.model';
import { WorkExperience } from '../../model/work.model';
import { VoluntaryWork } from '../../model/voluntary-work.model';
import { CharacterReference } from '../../model/character-reference.model';
import { CommonModule } from '@angular/common';
import { RoleName, Role } from '../../model/role.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EmployeeComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = []; // To hold the users for the current page
  basicDetails: BasicDetails | null = null;
  educationDetails: Education[] | null = null;
  personalDetails: PersonalDetails | null = null;
  contactDetails: ContactDetails | null = null;
  familyBackground: FamilyBackground | null = null;
  childrenDetails: Children[] | null = null;
  civilServiceEligibilities: CivilServiceEligibility[] | null = null;
  learningDetails: LearningDevelopment[] | null = null;
  workExperiences: WorkExperience[] | null = null;
  voluntaryWorks: VoluntaryWork[] | null = null;
  characterReferences: CharacterReference[] | null = null;
  isModalOpen: boolean = false;
  activeTab: string = 'basic';
  roleName = RoleName;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10; // Set the number of users per page to 10
  totalPages: number = 0;

  constructor(
    private userService: UserService,
    private basicDetailsService: BasicDetailsService,
    private educationService: EducationService,
    private personalDetailsService: PersonalDetailsService,
    private contactDetailsService: ContactDetailsService,
    private familyService: FamilyService,
    private childrenService: ChildrenService,
    private civilServiceService: CivilServiceService,
    private learningService: LearningService,
    private workService: WorkService,
    private voluntaryWorkService: VoluntaryWorkService,
    private characterReferenceService: CharacterReferenceService
  ) {}

  ngOnInit(): void {
    this.loadActiveUsers();
  }

  loadActiveUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.paginateUsers();
      },
      (error) => {
        console.error('Error fetching active users', error);
      }
    );
  }

  getRoleName(roles: { RoleName: string }[]): string {
    if (roles && roles.length > 0) {
      if (roles.some(role => role.RoleName.toLowerCase() === 'faculty')) return 'Faculty';
      if (roles.some(role => role.RoleName.toLowerCase() === 'staff')) return 'Staff';
      if (roles.some(role => role.RoleName.toLowerCase() === 'admin')) return 'Admin';
      if (roles.some(role => role.RoleName.toLowerCase() === 'superadmin')) return 'Super Admin';
      return roles[0].RoleName; // Return the first role if none of the above match
    }
    return 'Unknown';
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.paginateUsers();
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  // Method to paginate users based on the current page
  paginateUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(start, end);
  }

  // Method to go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateUsers();
    }
  }

  // Method to go to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers();
    }
  }

  // Method to set a specific page
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateUsers();
    }
  }

  openModal(user: User): void {
    this.isModalOpen = true;
    this.setActiveTab('basic');

    this.fetchBasicDetails(user.UserID);
    this.fetchEducationDetails(user.UserID);
    this.fetchPersonalDetails(user.UserID);
    this.fetchContactDetails(user.UserID);
    this.fetchFamilyDetails(user.UserID);
    this.fetchChildrenDetails(user.UserID);
    this.fetchCivilServiceEligibilities(user.UserID);
    this.fetchLearningDevelopments(user.UserID);
    this.fetchWorkExperiences(user.UserID);
    this.fetchVoluntaryWorks(user.UserID);
    this.fetchCharacterReferences(user.UserID);  // Fetch the character references
  }

  fetchBasicDetails(userId: number): void {
    this.basicDetailsService.getBasicDetails(userId).subscribe(
      (details) => (this.basicDetails = details),
      (error) => {
        console.error('Error fetching basic details', error);
        this.basicDetails = null;
      }
    );
  }

  fetchEducationDetails(userId: number): void {
    this.educationService.getEducationByUser(userId).subscribe(
      (details) => (this.educationDetails = details),
      (error) => {
        console.error('Error fetching education details', error);
        this.educationDetails = null;
      }
    );
  }

  fetchPersonalDetails(userId: number): void {
    this.personalDetailsService.getPersonalDetails(userId).subscribe(
      (details) => {
        console.log('Fetched personal details:', details); // Log to check if details are fetched
        this.personalDetails = details;
      },
      (error) => {
        console.error('Error fetching personal details', error);
        this.personalDetails = null;
      }
    );
  }

  fetchContactDetails(userId: number): void {
    this.contactDetailsService.getContactDetails(userId).subscribe(
      (details) => (this.contactDetails = details),
      (error) => {
        console.error('Error fetching contact details', error);
        this.contactDetails = null;
      }
    );
  }

  fetchFamilyDetails(userId: number): void {
    this.familyService.getFamilyBackground(userId).subscribe(
      (details) => (this.familyBackground = details),
      (error) => {
        console.error('Error fetching family background', error);
        this.familyBackground = null;
      }
    );
  }

  fetchChildrenDetails(userId: number): void {
    this.childrenService.getChildren(userId).subscribe(
      (details) => (this.childrenDetails = details),
      (error) => {
        console.error('Error fetching children details', error);
        this.childrenDetails = null;
      }
    );
  }

  fetchCivilServiceEligibilities(userId: number): void {
    this.civilServiceService.getCivilServiceEligibilities().subscribe(
      (details) => (this.civilServiceEligibilities = details),
      (error) => {
        console.error('Error fetching civil service eligibilities', error);
        this.civilServiceEligibilities = null;
      }
    );
  }

  fetchLearningDevelopments(userId: number): void {
    this.learningService.getLearningDevelopments(userId).subscribe(
      (details) => (this.learningDetails = details),
      (error) => {
        console.error('Error fetching learning developments', error);
        this.learningDetails = null;
      }
    );
  }

  fetchWorkExperiences(userId: number): void {
    this.workService.getWorkExperiences(userId).subscribe(
      (details) => (this.workExperiences = details),
      (error) => {
        console.error('Error fetching work experiences', error);
        this.workExperiences = null;
      }
    );
  }

  fetchVoluntaryWorks(userId: number): void {
    this.voluntaryWorkService.getVoluntaryWorks(userId).subscribe(
      (details) => (this.voluntaryWorks = details),
      (error) => {
        console.error('Error fetching voluntary works', error);
        this.voluntaryWorks = null;
      }
    );
  }

  fetchCharacterReferences(userId: number): void {
    console.log('Fetching character references for user ID:', userId);
    this.characterReferenceService.getReferences(userId).subscribe(
      (references) => (this.characterReferences = references),
      (error) => {
        console.error('Error fetching character references', error);
        this.characterReferences = null;
      }
    );
  }

  formatAddress(details: PersonalDetails | null, type: 'Residential' | 'Permanent'): string {
    if (!details) return '';
    let address = '';

    if (type === 'Residential') {
      address = `${details.ResidentialHouseBlockLot || ''} 
      ${details.ResidentialStreet || ''}, 
      ${details.ResidentialSubdivisionVillage || ''}, 
      ${details.ResidentialBarangay || ''}, 
      ${details.ResidentialCityMunicipality || ''}, 
      ${details.ResidentialProvince || ''}
      ${details.ResidentialZipCode || ''}`;
    } else if (type === 'Permanent') {
      address = `${details.PermanentHouseBlockLot || ''} 
      ${details.PermanentStreet || ''}, 
      ${details.PermanentSubdivisionVillage || ''}, 
      ${details.PermanentBarangay || ''}, 
      ${details.PermanentCityMunicipality || ''}, 
      ${details.PermanentProvince || ''} 
      ${details.PermanentZipCode || ''}`;
    }

    return address.replace(/\s+/g, ' ').trim(); // Clean up any extra spaces
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.clearDetails();
  }

  private clearDetails(): void {
    this.basicDetails = null;
    this.educationDetails = null;
    this.personalDetails = null;
    this.contactDetails = null;
    this.familyBackground = null;
    this.childrenDetails = null;
    this.civilServiceEligibilities = null;
    this.learningDetails = null;
    this.workExperiences = null;
    this.voluntaryWorks = null;
    this.characterReferences = null;
  }
}

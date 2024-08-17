import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BasicDetailsService } from '../../services/basic-details.service';
import { EducationService } from '../../services/education.service'; // Service for educational background
import { User } from '../../model/user.model';
import { BasicDetails } from '../../model/basic-details.model';
import { Education } from '../../model/education.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EmployeeComponent implements OnInit {
  users: User[] = [];
  basicDetails: BasicDetails | null = null;
  educationDetails: Education[] | null = null;
  isModalOpen: boolean = false;
  activeTab: string = 'basic';

  constructor(
    private userService: UserService,
    private basicDetailsService: BasicDetailsService,
    private educationService: EducationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  openModal(user: User): void {
    this.isModalOpen = true;
    this.setActiveTab('basic');

    // Fetch Basic Details
    this.basicDetailsService.getBasicDetails(user.UserID).subscribe(
      details => this.basicDetails = details,
      error => {
        console.error('Error fetching basic details', error);
        this.basicDetails = null;
      }
    );

    // Fetch Educational Background
    this.educationService.getEducationByUser(user.UserID).subscribe(
      details => this.educationDetails = details,
      error => {
        console.error('Error fetching education details', error);
        this.educationDetails = null;
      }
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.basicDetails = null;
    this.educationDetails = null;
  }
}

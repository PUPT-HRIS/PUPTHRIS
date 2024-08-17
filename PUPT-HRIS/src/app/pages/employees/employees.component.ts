import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BasicDetailsService } from '../../services/basic-details.service';
import { User } from '../../model/user.model';
import { BasicDetails } from '../../model/basic-details.model';
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
  basicDetails: BasicDetails | undefined | null = undefined;
  isModalOpen: boolean = false;

  constructor(
    private userService: UserService, 
    private basicDetailsService: BasicDetailsService,) {}

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
    this.basicDetails = undefined;
    this.isModalOpen = true;

    this.basicDetailsService.getBasicDetails(user.UserID).subscribe(
      details => {
        this.basicDetails = details || null;
      },
      error => {
        console.error('Error fetching basic details', error);
        this.basicDetails = null;
      }
    );
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.basicDetails = undefined;
  }
}

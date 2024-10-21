import { User } from './user.model';

export interface Coordinator {
  CoordinatorID: number;
  UserID: number;
  FirstName: string;
  Surname: string;
}

export interface Department {
  DepartmentID: number;
  DepartmentName: string;
  CoordinatorID: number | null;
  Coordinator: Coordinator | null;
  CollegeCampus: {
    CollegeCampusID: number;
    Name: string;
  };
}

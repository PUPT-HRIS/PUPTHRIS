import { User } from './user.model';

export interface Coordinator {
  CoordinatorID: number;
  UserID: number;
  User?: {
    FirstName: string;
    Surname: string;
  };
  // Add any other properties that are part of the Coordinator object
}

export interface Department {
  DepartmentID: number;
  DepartmentName: string;
  Coordinator?: Coordinator | null;
}

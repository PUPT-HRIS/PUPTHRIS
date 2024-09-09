import { Role } from "./role.model";

export interface User {
  UserID: number;
  Fcode: string;
  FirstName: string;
  MiddleName?: string;
  Surname: string;
  NameExtension?: string;
  EmploymentType: string;
  Department?: {
    DepartmentID: number;
    DepartmentName: string;
  };
  Roles: Role[];  // Reflects the many-to-many relationship with roles
}

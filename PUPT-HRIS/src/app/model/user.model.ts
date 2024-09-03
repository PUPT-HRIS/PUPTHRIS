export interface User {
  UserID: number;
  Fcode: string;
  FirstName: string;
  MiddleName?: string;
  Surname: string;
  NameExtension?: string;
  Role: string;
  EmploymentType: string;
  Department?: {
    DepartmentID: number;
    DepartmentName: string;
  };
}

export interface BasicDetails {
  BasicDetailsID?: number;
  EmployeeNo: string;
  FacultyCode?: string;
  Honorific?: string;
  LastName: string;
  FirstName: string;
  MiddleInitial?: string;
  NameExtension?: string;
  DateOfBirth?: Date;
  Sex?: 'Male' | 'Female' | 'Other';
  UserID: number;
}

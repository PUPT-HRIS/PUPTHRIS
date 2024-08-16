export interface WorkExperience {
  WorkExperienceID?: number;
  userID: number;
  InclusiveDatesFrom: Date;
  InclusiveDatesTo: Date;
  PositionTitle: string;
  DepartmentAgencyOfficeCompany: string;
  MonthlySalary: number;
  SalaryJobPayGrade: string;
  StatusOfAppointment: string;
  GovtService: boolean;
}

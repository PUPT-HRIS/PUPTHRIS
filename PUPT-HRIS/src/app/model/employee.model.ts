export interface Employee {
  EmployeeID?: number;
  LastName: string;
  FirstName: string;
  MiddleName?: string;
  NameExtension?: string;
  BirthDate: string;
  PlaceOfBirth?: string;
  Gender?: 'Male' | 'Female' | 'Other';
  CivilStatus?: string;
  Height?: number;
  Weight?: number;
  BloodType?: string;
  GSISNumber?: string;
  PagIbigNumber?: string;
  PhilHealthNumber?: string;
  SSSNumber?: string;
  TINNumber?: string;
  AgencyEmployeeNumber?: string;
  Citizenship?: string;
  ResidentialAddress?: string;
  ResidentialZipCode?: string;
  PermanentAddress?: string;
  PermanentZipCode?: string;
  TelephoneNumber?: string;
  MobileNumber?: string;
  EmailAddress?: string;
  UserID?: number;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 

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

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {
  private apiUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private http: HttpClient) { }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/add`, employee).pipe(
      catchError(this.handleError)
    );
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/update/${id}`, employee).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}
import { Component } from '@angular/core';
import { EmployeesComponent } from "./employees/employees.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [EmployeesComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}

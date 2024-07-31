import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ContentComponent } from "../content/content.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NavbarComponent, ContentComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeItem: string = 'dashboard';

  setActive(item: string) {
    this.activeItem = item;
  }
}

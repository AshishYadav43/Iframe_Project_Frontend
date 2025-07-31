import { Component } from '@angular/core';
import { SidebarComponent } from '../layout/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [SidebarComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage {

}

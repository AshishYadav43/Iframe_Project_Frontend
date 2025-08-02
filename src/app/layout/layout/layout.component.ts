import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet,HeaderComponent, MatSidenavModule,MatIconModule,
    MatToolbarModule,MatSidenavModule, MatListModule,],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
 sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

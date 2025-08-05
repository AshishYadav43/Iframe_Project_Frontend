import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterModule, NgIf,NgFor],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  showAddDefaults = false;

  addDefaultsChildren = [
    { name: 'Country', route: '/countries' },
    { name: 'Currency', route: '/currencies' },
    { name: 'Company', route: '/company' }
  ];


  private router = inject(Router);
  private api = inject(AuthService)
  logout() {
    this.api.logout().subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
      }
    })
  }

    toggleAddDefaults() {
    this.showAddDefaults = !this.showAddDefaults;
  }
}

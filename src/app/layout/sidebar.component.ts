import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterModule, NgIf, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  showAddDefaults = false;
  showSportChildren = false;
  showAddDefault = false;

  sportChildRoutes: string[] = [];
  addDefaultsChildRoutes: string[] = [];
  addDefaultsChildren = [
    {
      name: 'Sport',
      route: '/sports-management?tab=0',
      icon: 'sports',
      children: [
        { name: 'Competition', route: '/comptitionprovider', icon: 'emoji_events' },
      ]
    },
    { name: 'Casino', route: '/casino', icon: 'casino' }
  ];

  addDefaultsjaved = [
    { name: 'Country', route: '/countries', icon: 'public' },
    { name: 'Currency', route: '/currencies', icon: 'currency_exchange' },
    { name: 'Company', route: '/company', icon: 'business' }
  ];

  private router = inject(Router);
  private api = inject(AuthService);

  logout() {
    this.api.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleAddDefaults() {
    this.showAddDefaults = !this.showAddDefaults;
  }

  toggleSportChildren() {
    this.showSportChildren = !this.showSportChildren;
    this.router.navigate(['/sports-management'], { queryParams: { tab: 0 } });
  }

  toggleDefaults() {
    this.showAddDefault = !this.showAddDefault;
  }

  // isParentActive(childRoutes: string[]): boolean {
  //   return childRoutes.some(route => this.router.isActive(route, false));
  // }

  isParentActive(childRoutes: string[]): boolean {
    const currentUrl = this.router.url.split('?')[0];
    return childRoutes.some(route =>
      currentUrl == route || currentUrl.startsWith(route + '/')
    );
  }
}

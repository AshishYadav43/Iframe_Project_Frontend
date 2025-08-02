import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})

export class DashboardPage {

  private api = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.checkLogin();
  }

  checkLogin() {
    this.api.checkLogin().subscribe({
      next: (res: any) => {
        if (!res.data.isLoggedIn) {
          this.router.navigate(['/login']);
        }
      }
    })
    
  }

}

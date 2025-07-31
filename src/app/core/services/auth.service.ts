import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private cookieService: CookieService) {}

  login(username: string, password: string): boolean {
    if (username === 'admin@gmail.com' && password === 'admin@123') {
      this.cookieService.set('token', 'dummy-token', 1); // expires in 1 day
      return true;
    }
    return false;
  }

  logout() {
    this.cookieService.delete('token');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('token');
  }
}

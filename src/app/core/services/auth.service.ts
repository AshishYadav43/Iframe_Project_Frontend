import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated = false;

  login(username: string, password: string): boolean {
    // Sample hardcoded auth check, replace with real API call
    if (username === 'admin@gmail.com' && password === 'admin@123') {
      this.isAuthenticated = true;
      localStorage.setItem('token', 'dummy-token');
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}

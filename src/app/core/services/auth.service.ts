import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { baseUrl } from '../constant/constant';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http : HttpClient
  ) { }

  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/auth/login`, data);
  }
  
  getRole(data: any = {}): Observable<any> {
    return this.http.post(`${baseUrl}/auth/roles`, data);
  }
}

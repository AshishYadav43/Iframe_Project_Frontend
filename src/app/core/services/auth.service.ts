import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { baseUrl, baseUserUrl } from '../constant/constant';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http : HttpClient
  ) { }

  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/auth/login`, data);
  }

  addCountry(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/countries/addCountry`, data);
  }

  getAllCountries(): Observable<any> {
    return this.http.post(`${baseUserUrl}/countries/lists`, {});
  }
  
  getRole(data: any = {}): Observable<any> {
    return this.http.post(`${baseUrl}/auth/roles`, data);
  }

  getUsers(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/users/get`, data);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

// import { baseUrl, baseUserUrl } from '../constant/constant';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private baseUserUrl = environment.userApiUrl;
  private toaster = inject(ToastrService);
  constructor(
    private http: HttpClient
  ) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  addCountry(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/country/addCountry`, data);
  }

  getAllCountries(): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/country/lists`, {});
  }

  getRole(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/roles/get`, data);
  }

  getUsers(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/users/get`, data);
  }

  updateUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/users/get`, data);
  }

  addUser(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/users/add-user`, data);
  }
  addCurrency(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/currency/add`, data);
  }

  getAllCurrencies(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/currency/getCurrency`, data);
  }

  getAllSports(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/sport/getSports`, data);
  }

  addSport(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/sport/createSport`, data);
  }

  updateSport(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/sport/updateSport`, data);
  }

  updateComptition(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/users/get`, data);
  }

  addComptition(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/competition/add`, data);
  }

  getComptition(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/competition/get`, data);
  }

  getCompany(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/company/lists`, data);
  }

  addCompany(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/company/add`, data);
  }

  checkLogin(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/check-login`, data);
  }

  timezone(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/country/timezone`, data);
  }

  logout(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, data);
  }

  getPermission(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/permission/role-permission`, data);
  }

  toasterError(err: any) {
    this.toaster.error(err)
  }
}

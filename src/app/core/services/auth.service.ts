import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { baseUrl, baseUserUrl } from '../constant/constant';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private toaster = inject(ToastrService);
  constructor(
    private http: HttpClient
  ) { }

  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/auth/login`, data);
  }

  addCountry(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/country/addCountry`, data);
  }

  getAllCountries(): Observable<any> {
    return this.http.post(`${baseUserUrl}/country/lists`, {});
  }

  getRole(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/roles/get`, data);
  }

  getUsers(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/users/get`, data);
  }

  updateUser(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/users/get`, data);
  }

  addUser(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/users/add-user`, data);
  }
  addCurrency(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/currency/add`, data);
  }

  getAllCurrencies(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/currency/getCurrency`, data);
  }

  getAllSports(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/sport/getSports`, data);
  }

  addSport(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/sport/createSport`, data);
  }

  updateSport(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/sport/updateSport`, data);
  }

  updateComptition(data: any): Observable<any> {
    return this.http.post(`${baseUserUrl}/users/get`, data);
  }

  addComptition(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/competition/add`, data);
  }

  getComptition(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/competition/get`, data);
  }

  getCompany(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/company/lists`, data);
  }

  addCompany(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/company/add`, data);
  }

  checkLogin(data: any = {}): Observable<any> {
    return this.http.post(`${baseUrl}/auth/check-login`, data);
  }

  timezone(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/country/timezone`, data);
  }

  logout(data: any = {}): Observable<any> {
    return this.http.post(`${baseUrl}/auth/logout`, data);
  }

  toasterError(err: any) {
    this.toaster.error(err)
  }
}

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
    return this.http.post(`${baseUserUrl}/roles/get`, data);
  }

  getUsers(data: any = {}): Observable<any> {
    return this.http.post(`${baseUserUrl}/users/get`, data);
  }

  updateUser(data: any ) : Observable<any> {
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
}

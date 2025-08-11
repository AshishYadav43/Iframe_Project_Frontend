import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private baseUserUrl = environment.userApiUrl;
  private toaster = inject(ToastrService);
  private fingerprint!: string;
  private deviceId!: string;
  constructor(
    private http: HttpClient
  ) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  addCountry(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/country/addCountry`, data);
  }

  updateCountry(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/country/update`, data);
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

  updateCurrency(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/currency/update`, data);
  }

  getAllCurrencies(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/currency/getCurrency`, data);
  }

  getAllSports(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/sport/getSports`, data);
  }

  getAllBaseSports(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/base-sport/getSports`, data);
  }

  addSport(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/sport/createSport`, data);
  }

  updateSport(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/sport/update`, data);
  }

  updateBaseSport(data: any): Observable<any> {
    return this.http.put(`${this.baseUserUrl}/base-sport/update`, data);
  }

  getAllCasino(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/casino/get`, data);
  }
  addCasino(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/casino/create-casino`, data);
  }
  updateCasino(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/casino/update`, data);
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

  updateCompany(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/company/update`, data);
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

  addProvider(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/provider/add`, data);
  }

  getProvider(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/provider/get`, data);
  }

  addCasinoGame(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/casino-games/add`, data);
  }

  getCasinoGame(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/casino-games/get`, data);
  }
  
  async getFingerprint(): Promise<any> {
    let result: any;
    if (!this.fingerprint) {
      const fp = await FingerprintJS.load();
      result = await fp.get();
      this.fingerprint = result.visitorId;
      this.deviceId = this.generateDeviceId(result.visitorId);
    }
    return {
      fingerprint: this.fingerprint,
      deviceId: this.deviceId
    };
  }

  private generateDeviceId(fingerprintId: string): string {
    return `DEV-${btoa(fingerprintId).replace(/=/g, '').substring(0, 12)}`;
  }

  addLoginPermission(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/login-permission/add`, data);
  }

  addBaseSports(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/base-sport/createSport`, data);
  }

  getBaseSportSubType(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/base-sport/sport-with-type`, data);
  }

  getAllUsedIds(): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/numeric-config/get`, {});
  }

  getAllStaticComapany(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/country/countries-list`, data);

  }

    uploadImage(data: any): Observable<any> {
    return this.http.post(`${this.baseUserUrl}/casino-games/upload-image`, data);

  }



}

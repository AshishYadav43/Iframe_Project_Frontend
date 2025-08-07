import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private casinoFilterSubject = new BehaviorSubject<any | null>(null);
  casinoFilter$ = this.casinoFilterSubject.asObservable();

  // Call this method from SportManagementComponent
  setCasinoFilter(payload: any) {
    this.casinoFilterSubject.next(payload);
  }
}

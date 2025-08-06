import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoManagementComponent } from './casino-management.component';

describe('CasinoManagementComponent', () => {
  let component: CasinoManagementComponent;
  let fixture: ComponentFixture<CasinoManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasinoManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

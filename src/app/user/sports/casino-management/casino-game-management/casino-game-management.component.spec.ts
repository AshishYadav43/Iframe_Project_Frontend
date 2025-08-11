import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoGameManagementComponent } from './casino-game-management.component';

describe('CasinoGameManagementComponent', () => {
  let component: CasinoGameManagementComponent;
  let fixture: ComponentFixture<CasinoGameManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasinoGameManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoGameManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

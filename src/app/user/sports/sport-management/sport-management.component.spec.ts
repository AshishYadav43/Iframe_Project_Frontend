import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportManagementComponent } from './sport-management.component';

describe('SportManagementComponent', () => {
  let component: SportManagementComponent;
  let fixture: ComponentFixture<SportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

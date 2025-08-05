import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSportManagementComponent } from './base-sport-management.component';

describe('BaseSportManagementComponent', () => {
  let component: BaseSportManagementComponent;
  let fixture: ComponentFixture<BaseSportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseSportManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseSportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

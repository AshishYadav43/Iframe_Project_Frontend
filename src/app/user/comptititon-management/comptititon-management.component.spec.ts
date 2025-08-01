import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptititonManagementComponent } from './comptititon-management.component';

describe('ComptititonManagementComponent', () => {
  let component: ComptititonManagementComponent;
  let fixture: ComponentFixture<ComptititonManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComptititonManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComptititonManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

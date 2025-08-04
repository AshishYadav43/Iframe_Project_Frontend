import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPermissionManagementComponent } from './login-permission-management.component';

describe('LoginPermissionManagementComponent', () => {
  let component: LoginPermissionManagementComponent;
  let fixture: ComponentFixture<LoginPermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPermissionManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyUserComponent } from './edit-company-user.component';

describe('EditCompanyUserComponent', () => {
  let component: EditCompanyUserComponent;
  let fixture: ComponentFixture<EditCompanyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompanyUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompanyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

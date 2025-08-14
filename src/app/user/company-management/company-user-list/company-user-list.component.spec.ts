import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUserListComponent } from './company-user-list.component';

describe('CompanyUserListComponent', () => {
  let component: CompanyUserListComponent;
  let fixture: ComponentFixture<CompanyUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserPageComponent } from './add-edit-user-page.component';

describe('AddEditUserPageComponent', () => {
  let component: AddEditUserPageComponent;
  let fixture: ComponentFixture<AddEditUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditUserPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

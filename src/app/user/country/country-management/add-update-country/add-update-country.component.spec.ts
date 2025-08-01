import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCountryComponent } from './add-update-country.component';

describe('AddUpdateCountryComponent', () => {
  let component: AddUpdateCountryComponent;
  let fixture: ComponentFixture<AddUpdateCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateCountryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

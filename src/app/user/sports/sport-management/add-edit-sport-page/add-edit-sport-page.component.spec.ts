import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSportPageComponent } from './add-edit-sport-page.component';

describe('AddEditSportPageComponent', () => {
  let component: AddEditSportPageComponent;
  let fixture: ComponentFixture<AddEditSportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSportPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

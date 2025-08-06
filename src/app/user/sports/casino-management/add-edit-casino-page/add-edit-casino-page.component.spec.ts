import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCasinoPageComponent } from './add-edit-casino-page.component';

describe('AddEditCasinoPageComponent', () => {
  let component: AddEditCasinoPageComponent;
  let fixture: ComponentFixture<AddEditCasinoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCasinoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCasinoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

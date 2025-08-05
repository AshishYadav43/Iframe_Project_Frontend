import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBaseSportComponent } from './add-update-base-sport.component';

describe('AddUpdateBaseSportComponent', () => {
  let component: AddUpdateBaseSportComponent;
  let fixture: ComponentFixture<AddUpdateBaseSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateBaseSportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateBaseSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

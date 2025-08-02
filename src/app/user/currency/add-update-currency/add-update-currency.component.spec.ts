import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCurrencyComponent } from './add-update-currency.component';

describe('AddUpdateCurrencyComponent', () => {
  let component: AddUpdateCurrencyComponent;
  let fixture: ComponentFixture<AddUpdateCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateCurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

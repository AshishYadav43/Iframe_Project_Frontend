import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCasinoGameComponent } from './add-update-casino-game.component';

describe('AddUpdateCasinoGameComponent', () => {
  let component: AddUpdateCasinoGameComponent;
  let fixture: ComponentFixture<AddUpdateCasinoGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateCasinoGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateCasinoGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

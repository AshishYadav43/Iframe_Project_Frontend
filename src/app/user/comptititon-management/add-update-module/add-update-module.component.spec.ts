import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateModuleComponent } from './add-update-module.component';

describe('AddUpdateModuleComponent', () => {
  let component: AddUpdateModuleComponent;
  let fixture: ComponentFixture<AddUpdateModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

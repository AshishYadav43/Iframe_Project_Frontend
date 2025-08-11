import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProviderComponent } from './add-update-provider.component';

describe('AddUpdateProviderComponent', () => {
  let component: AddUpdateProviderComponent;
  let fixture: ComponentFixture<AddUpdateProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

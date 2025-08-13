import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProviderBaseTypeComponent } from './view-provider-base-type.component';

describe('ViewProviderBaseTypeComponent', () => {
  let component: ViewProviderBaseTypeComponent;
  let fixture: ComponentFixture<ViewProviderBaseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProviderBaseTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProviderBaseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompitionProviderComponent } from './compition-provider.component';

describe('CompitionProviderComponent', () => {
  let component: CompitionProviderComponent;
  let fixture: ComponentFixture<CompitionProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompitionProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompitionProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

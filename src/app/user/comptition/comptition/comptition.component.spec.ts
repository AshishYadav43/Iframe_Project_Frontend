import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptitionComponent } from './comptition.component';

describe('ComptitionComponent', () => {
  let component: ComptitionComponent;
  let fixture: ComponentFixture<ComptitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComptitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComptitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

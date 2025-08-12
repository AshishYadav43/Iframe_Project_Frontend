import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFileUploadComponent } from './shared-file-upload.component';

describe('SharedFileUploadComponent', () => {
  let component: SharedFileUploadComponent;
  let fixture: ComponentFixture<SharedFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

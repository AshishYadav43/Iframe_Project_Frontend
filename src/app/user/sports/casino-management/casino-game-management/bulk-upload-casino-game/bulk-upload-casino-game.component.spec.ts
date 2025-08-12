import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadCasinoGameComponent } from './bulk-upload-casino-game.component';

describe('BulkUploadCasinoGameComponent', () => {
  let component: BulkUploadCasinoGameComponent;
  let fixture: ComponentFixture<BulkUploadCasinoGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkUploadCasinoGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkUploadCasinoGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

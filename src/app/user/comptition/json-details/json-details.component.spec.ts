import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonDetailsComponent } from './json-details.component';

describe('JsonDetailsComponent', () => {
  let component: JsonDetailsComponent;
  let fixture: ComponentFixture<JsonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

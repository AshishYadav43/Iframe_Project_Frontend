import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedSportsIdsComponent } from './used-sports-ids.component';

describe('UsedSportsIdsComponent', () => {
  let component: UsedSportsIdsComponent;
  let fixture: ComponentFixture<UsedSportsIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsedSportsIdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsedSportsIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

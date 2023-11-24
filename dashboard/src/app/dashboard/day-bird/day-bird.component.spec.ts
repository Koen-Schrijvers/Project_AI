import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBirdComponent } from './day-bird.component';

describe('DayBirdComponent', () => {
  let component: DayBirdComponent;
  let fixture: ComponentFixture<DayBirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayBirdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayBirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

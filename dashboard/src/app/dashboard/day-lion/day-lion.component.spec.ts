import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayLionComponent } from './day-lion.component';

describe('DayLionComponent', () => {
  let component: DayLionComponent;
  let fixture: ComponentFixture<DayLionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayLionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayLionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDagWetenschapComponent } from './chart-dag-wetenschap.component';

describe('ChartDagWetenschapComponent', () => {
  let component: ChartDagWetenschapComponent;
  let fixture: ComponentFixture<ChartDagWetenschapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartDagWetenschapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartDagWetenschapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartVolumeDisplayer9000Component } from './bar-chart-volume-displayer9000.component';

describe('BarChartVolumeDisplayer9000Component', () => {
  let component: BarChartVolumeDisplayer9000Component;
  let fixture: ComponentFixture<BarChartVolumeDisplayer9000Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartVolumeDisplayer9000Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChartVolumeDisplayer9000Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

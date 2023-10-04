import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSensorComponent } from './map-sensor.component';

describe('MapSensorComponent', () => {
  let component: MapSensorComponent;
  let fixture: ComponentFixture<MapSensorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapSensorComponent]
    });
    fixture = TestBed.createComponent(MapSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

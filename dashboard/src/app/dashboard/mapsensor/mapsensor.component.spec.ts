import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsensorComponent } from './mapsensor.component';

describe('MapsensorComponent', () => {
  let component: MapsensorComponent;
  let fixture: ComponentFixture<MapsensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OorzaakdashboardComponent } from './oorzaakdashboard.component';

describe('OorzaakdashboardComponent', () => {
  let component: OorzaakdashboardComponent;
  let fixture: ComponentFixture<OorzaakdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OorzaakdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OorzaakdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

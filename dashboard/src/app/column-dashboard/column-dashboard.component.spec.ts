import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDashboardComponent } from './column-dashboard.component';

describe('ColumnDashboardComponent', () => {
  let component: ColumnDashboardComponent;
  let fixture: ComponentFixture<ColumnDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

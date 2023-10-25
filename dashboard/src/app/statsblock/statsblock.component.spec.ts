import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsblockComponent } from './statsblock.component';

describe('StatsblockComponent', () => {
  let component: StatsblockComponent;
  let fixture: ComponentFixture<StatsblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsblockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

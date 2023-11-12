import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLionComponent } from './line-lion.component';

describe('LineLionComponent', () => {
  let component: LineLionComponent;
  let fixture: ComponentFixture<LineLionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineLionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineLionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

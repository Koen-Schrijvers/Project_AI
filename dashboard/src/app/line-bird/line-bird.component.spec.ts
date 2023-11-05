import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineBirdComponent } from './line-bird.component';

describe('LineBirdComponent', () => {
  let component: LineBirdComponent;
  let fixture: ComponentFixture<LineBirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineBirdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineBirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalebarComponent } from './scalebar.component';

describe('ScalebarComponent', () => {
  let component: ScalebarComponent;
  let fixture: ComponentFixture<ScalebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScalebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

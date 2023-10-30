import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveblockComponent } from './liveblock.component';

describe('LiveblockComponent', () => {
  let component: LiveblockComponent;
  let fixture: ComponentFixture<LiveblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveblockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

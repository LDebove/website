import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tww3RandomLordComponent } from './tww3-random-lord.component';

describe('Tww3RandomLordComponent', () => {
  let component: Tww3RandomLordComponent;
  let fixture: ComponentFixture<Tww3RandomLordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tww3RandomLordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tww3RandomLordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

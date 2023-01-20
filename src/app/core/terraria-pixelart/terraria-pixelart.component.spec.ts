import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrariaPixelartComponent } from './terraria-pixelart.component';

describe('TerrariaPixelartComponent', () => {
  let component: TerrariaPixelartComponent;
  let fixture: ComponentFixture<TerrariaPixelartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerrariaPixelartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerrariaPixelartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

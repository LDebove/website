import { TestBed } from '@angular/core/testing';

import { PixelartService } from './pixelart.service';

describe('PixelartService', () => {
  let service: PixelartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PixelartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

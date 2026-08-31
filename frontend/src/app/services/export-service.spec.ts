import { TestBed } from '@angular/core/testing';

import { ExportPDF } from './export-service';

describe('ExportPDF', () => {
  let service: ExportPDF;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportPDF);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

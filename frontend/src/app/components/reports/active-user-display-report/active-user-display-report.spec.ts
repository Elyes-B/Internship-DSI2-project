import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUserDisplayReport } from './active-user-display-report';

describe('ActiveUserDisplayReport', () => {
  let component: ActiveUserDisplayReport;
  let fixture: ComponentFixture<ActiveUserDisplayReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveUserDisplayReport],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveUserDisplayReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogsDisplayReport } from './user-logs-display-report';

describe('UserLogsDisplayReport', () => {
  let component: UserLogsDisplayReport;
  let fixture: ComponentFixture<UserLogsDisplayReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLogsDisplayReport],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLogsDisplayReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

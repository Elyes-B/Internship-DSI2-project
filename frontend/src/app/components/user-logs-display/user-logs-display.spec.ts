import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogsDisplay } from './user-logs-display';

describe('UserLogsDisplay', () => {
  let component: UserLogsDisplay;
  let fixture: ComponentFixture<UserLogsDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLogsDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLogsDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

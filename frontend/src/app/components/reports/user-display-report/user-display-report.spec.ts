import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDisplayReport } from './user-display-report';

describe('UserDisplayReport', () => {
  let component: UserDisplayReport;
  let fixture: ComponentFixture<UserDisplayReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDisplayReport],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDisplayReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

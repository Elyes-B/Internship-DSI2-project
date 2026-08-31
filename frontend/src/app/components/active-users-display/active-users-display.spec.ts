import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUsersDisplay } from './active-users-display';

describe('ActiveUsersDisplay', () => {
  let component: ActiveUsersDisplay;
  let fixture: ComponentFixture<ActiveUsersDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveUsersDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveUsersDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

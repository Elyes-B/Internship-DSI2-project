import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDisplay } from './user-display';

describe('UserDisplay', () => {
  let component: UserDisplay;
  let fixture: ComponentFixture<UserDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

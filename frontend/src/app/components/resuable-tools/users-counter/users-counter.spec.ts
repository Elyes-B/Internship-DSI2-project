import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCounter } from './users-counter';

describe('UsersCounter', () => {
  let component: UsersCounter;
  let fixture: ComponentFixture<UsersCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCounter],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersCounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

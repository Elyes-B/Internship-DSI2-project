import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarSessions } from './searchbar-sessions';

describe('SearchbarSessions', () => {
  let component: SearchbarSessions;
  let fixture: ComponentFixture<SearchbarSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarSessions],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarSessions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

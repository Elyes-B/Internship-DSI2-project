import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarUsers } from './searchbar-users';

describe('SearchbarUsers', () => {
  let component: SearchbarUsers;
  let fixture: ComponentFixture<SearchbarUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarUsers],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

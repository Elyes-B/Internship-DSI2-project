import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarLogs } from './searchbar-logs';

describe('SearchbarLogs', () => {
  let component: SearchbarLogs;
  let fixture: ComponentFixture<SearchbarLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

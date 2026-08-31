import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilterSessions } from '../../../models/search-filter-sessions';

@Component({
  selector: 'app-searchbar-sessions',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar-sessions.html',
  styleUrl: './searchbar-sessions.css',
})
export class SearchbarSessions {
  //all the searchbar reusable elements are similar, we have the default variable for the filters, and we have method for
  // reseting , applying and sending the filters to the parent component
  searchSessionId: string = '';
  searchKeycloakId: string = '';
  searchUsername: string = '';
  searchIpAddress: string = '';
  onlyActiveSessions: boolean = false;

  // Events emitted to parent
  @Output() filterApplied = new EventEmitter<void>();
  @Output() filterReset = new EventEmitter<void>();
  @Output() sendFilters = new EventEmitter<SearchFilterSessions>();

  applyFilters(): void {
    this.filtersToParent();
    this.filterApplied.emit();
  }

  resetFilters(): void {
    this.searchKeycloakId = '';
    this.searchSessionId = '';
    this.searchUsername = '';
    this.searchIpAddress = '';
    this.onlyActiveSessions = false;

    this.filtersToParent();
    this.filterReset.emit();
  }

  filtersToParent(): void {
    this.sendFilters.emit({
      searchSessionId: this.searchSessionId,
      searchKeycloakId: this.searchKeycloakId,
      searchUsername: this.searchUsername,
      searchIpAddress: this.searchIpAddress,
      onlyActiveSessions: this.onlyActiveSessions 
    });
  }
}

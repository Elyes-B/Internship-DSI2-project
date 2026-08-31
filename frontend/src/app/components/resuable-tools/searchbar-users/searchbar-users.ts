import { FormsModule } from '@angular/forms';
import { SearchbarFiltersUsers } from './../../../models/searchbar-filters-users';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule} from '@angular/common';


@Component({
  selector: 'app-searchbar-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './searchbar-users.html',
  styleUrl: './searchbar-users.css',
})
export class SearchbarUsers {
  //all the searchbar reusable elements are similar, we have the default variable for the filters, and we have method for
  // reseting , applying and sending the filters to the parent component
  searchId: number  = 0;
  searchQuery: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  // Events emitted to parent
  @Output() filterApplied = new EventEmitter<void>();
  @Output() filterReset = new EventEmitter<void>();
  @Output() sendFilters = new EventEmitter<SearchbarFiltersUsers>();

  applyFilters(): void {
    this.filtersToParent();
    this.filterApplied.emit();
  }

  resetFilters(): void {
    this.searchId = 0;
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';

    this.filtersToParent();
    this.filterReset.emit();
  }

  filtersToParent():void{
    this.sendFilters.emit({
      'searchId':this.searchId,
      'searchQuery':this.searchQuery,
      'selectedRole':this.selectedRole,
      'selectedStatus':this.selectedStatus
    }
    )
  }
}

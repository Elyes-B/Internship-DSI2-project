import { Component, EventEmitter, Output } from '@angular/core';
import { SearchFilterLogs } from '../../../models/search-filter-logs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar-logs',
  imports: [FormsModule],
  templateUrl: './searchbar-logs.html',
  styleUrl: './searchbar-logs.css',
})

export class SearchbarUserLogs {
  //all the searchbar reusable elements are similar, we have the default variable for the filters, and we have method for
  // reseting , applying and sending the filters to the parent component
  @Output() filterApplied = new EventEmitter<void>();
  @Output() filterReset = new EventEmitter<void>();
  @Output() sendFilters = new EventEmitter<SearchFilterLogs>();

  searchFilters: SearchFilterLogs = {
    id: 0,
    userId: '',
    username: '',
    ipAddress: '',
    controllerMethod: '',
    actionType: '',
    startDate: '',
    endDate: ''
  };

  // Helper bindings for date input strings
  startDateStr: string = '';
  endDateStr: string = '';

  // i added this method since php datetime was not deing displayed  correctly
  private formatDateToString(dateValue: string | Date | null): string {
    if (!dateValue) return '';
    const dateObj = new Date(dateValue);
    if (isNaN(dateObj.getTime())) return '';
    // Formats as YYYY-MM-DD for clean HTTP GET parameters
    return dateObj.toISOString().split('T')[0];
  }

  applyFilters(): void {
    // Convert dates to string format before sending
    this.searchFilters.startDate = this.formatDateToString(this.startDateStr);
    this.searchFilters.endDate = this.formatDateToString(this.endDateStr);

    this.sendFilters.emit(this.searchFilters);
    this.filterApplied.emit();
  }

  resetFilters(): void {
    this.searchFilters = {
      id: 0,
      userId: '',
      username: '',
      ipAddress: '',
      controllerMethod: '',
      actionType: '',
      startDate: '',
      endDate: ''
    };
    this.startDateStr = '';
    this.endDateStr = '';

    this.sendFilters.emit(this.searchFilters);
    this.filterReset.emit();
  }
}


import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { UserLog } from '../../models/user-log';
import { SearchFilterLogs } from '../../models/search-filter-logs';
import { UserService } from '../../services/user';
import { IntervalService } from '../../services/interval-service';
import { SearchbarUserLogs } from '../resuable-tools/searchbar-logs/searchbar-logs';
import { ExportService } from '../../services/export-service';
import { UserLogsDisplayReport } from "../reports/user-logs-display-report/user-logs-display-report";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-logs-display',
  imports: [SearchbarUserLogs, UserLogsDisplayReport,FormsModule],
  templateUrl: './user-logs-display.html',
  styleUrl: './user-logs-display.css',
})
export class UserLogsDisplay {
  private userService = inject(UserService);
  @ViewChild('export') export!: ElementRef<HTMLElement>;
  private intervalService = inject(IntervalService);
  isExporting: boolean = false;
  private exportService = inject(ExportService);
  logs: UserLog[] = [];
  isLoading: boolean = false;
  filters: SearchFilterLogs = {
    id: 0,
    userId: '',
    username: '',
    ipAddress: '',
    controllerMethod: '',
    actionType: '',
    startDate: '',
    endDate: ''
  };

  loadUsers(): void {

    //loading variables will determine if we show a spinning animate or not
    this.isLoading = true;
    //this service method gets our users from backend
    this.userService.getUserLogs(this.filters.id,this.filters.userId,this.filters.username,this.filters.ipAddress,
      this.filters.controllerMethod,this.filters.actionType,this.filters.startDate,this.filters.endDate
    )
      .subscribe({
        next: (response) => {
          //if we get a response we attach to the variable
          this.logs = response.data;
          console.log(this.logs);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.isLoading = false;
        }
      });
  }

  timerId:any;

  //when the page loads fetch all users
  ngOnInit(): void {
    this.timerId = this.intervalService.startPolling(()=>this.loadUsers(),60000);
  }

  ngOnDestroy(): void {
  this.intervalService.stopPolling(this.timerId);
  }

  // Selected log for detailed view
  selectedLog: UserLog | null = null;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.logs.length / this.pageSize) || 1;
  }

  get paginatedLogs(): UserLog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.logs.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  selectLog(log: UserLog): void {
    this.selectedLog = log;
  }

onFiltersApplied(): void {
  this.currentPage = 1;
  this.loadUsers(); // Pass filters to your API call
}

onFiltersReset(): void {
  this.currentPage = 1;
  this.loadUsers(); // Fetch default/unfiltered list
}

recieveFilters(filters:SearchFilterLogs):void{
  this.filters = filters;
}

//methods for exporting
  exportMaxLimit:number = 1;
  exportAllUsers:boolean = false;
  exportUsers:UserLog[] = [];
  selectedExportFormat: string = 'pdf';

public handleExport(): void {
    this.isExporting = true;

    if(this.exportAllUsers){
      this.exportMaxLimit = this.logs.length;
    }

    // Slice all users matching current active filters up to the max limit chosen by user
    this.exportUsers = this.logs.slice(0, this.exportMaxLimit);

    setTimeout(() => {
    // Extract the raw HTML element directly from the native DOM node
    const rawHTML = document.getElementById('pdf-report-root');

  if (!rawHTML) {
  console.error('Export failed: "pdf-report-root" element was not found in the DOM.');
  return;
  }

if (this.selectedExportFormat == 'pdf')
this.exportService.exportToPdf(rawHTML, 'userListingReport.pdf');
else
this.exportService.exportToExcel(rawHTML,'userListingReport.xlsx')
  }, 100);

  this.isExporting = false;


}

}

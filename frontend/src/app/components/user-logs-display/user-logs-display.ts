
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
  //we inject all the services we need
  private userService = inject(UserService);
  private exportService = inject(ExportService);
  private intervalService = inject(IntervalService);

  //this marks the html element that will be used for exporting, if an element has #export this line will detect it and save its html
  @ViewChild('export') export!: ElementRef<HTMLElement>;
  isExporting: boolean = false;
  logs: UserLog[] = []; // contains the list of all logs that will be displayed
  isLoading: boolean = false;
  // the search filter, we first intialize it with empty values
  // to filter the logs with dates as request we need a start date and end date
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

  // if the users leaves the component it self closes the method its been running with the interval service
  ngOnDestroy(): void {
  this.intervalService.stopPolling(this.timerId);
  }

  // Selected log for detailed view
  selectedLog: UserLog | null = null;

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 10;

  // total pages variables that gets displays the bottom of the table
  get totalPages(): number {
    return Math.ceil(this.logs.length / this.pageSize) || 1;
  }

  // returns the paginated logs to show in the display table depending on the page choosen( i choose to paginate the data so the user doesnt have to scroll to see all the data)
  get paginatedLogs(): UserLog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.logs.slice(startIndex, startIndex + this.pageSize);
  }

  // a button triggers this to change the current page
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // since the  log showcased in the table  lacks some of the info requested by the team, i choose to add a button that shows a modal with all the data
  // to do that i made the button select the choosen log and then triggers the modal with the selected log
  selectLog(log: UserLog): void {
    this.selectedLog = log;
  }

onFiltersApplied(): void {
  this.currentPage = 1;
  this.loadUsers(); // passes the filters entered by the user and resets the page count
}

onFiltersReset(): void {
  this.currentPage = 1;
  this.loadUsers(); // resets filters and pages
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

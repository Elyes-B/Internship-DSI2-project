import { UsersCounter } from './../resuable-tools/users-counter/users-counter';
import { SearchbarUsers } from './../resuable-tools/searchbar-users/searchbar-users';
import { SearchbarFiltersUsers } from './../../models/searchbar-filters-users';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { ExportService } from '../../services/export-service';
import { UserModel } from '../../models/user.model';
import { IntervalService } from '../../services/interval-service';
import { UserDisplayReport } from '../reports/user-display-report/user-display-report';




@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [CommonModule,FormsModule,UserDisplayReport,SearchbarUsers,UsersCounter],
  templateUrl: './user-display.html',
  styleUrl: './user-display.css',
})
export class UserDisplay implements OnInit,OnDestroy{
  private userService = inject(UserService);
  @ViewChild('export') export!: ElementRef<HTMLElement>;

  filters:SearchbarFiltersUsers = {
    'searchId':0,
    'searchQuery':'',
    'selectedRole':'',
    'selectedStatus':''
  };

  private intervalService = inject(IntervalService);
  timerId:any;
  allUsers: UserModel[] = [];
  isLoading: boolean = false;
  isExporting: boolean = false;
  private exportService = inject(ExportService);

  //declaring this varaible so that i can use the math methods in html
  public Math = Math;





  //used for pagniating the user display table
  currentPage: number = 1;
  pageSize: number = 20;

  //when the page loads fetch all users
  ngOnInit(): void {
    this.timerId = this.intervalService.startPolling(()=>this.loadUsers(),60000);
  }
    //counters used for the counter components
    get totalUsersCount(){
      return this.userService.totalUsersCount(this.allUsers);
    }
    get totalAdminCount(){
      return this.userService.totalAdminCount(this.allUsers);
    }
    get totalSuperadminCount(){
      return this.userService.totalSuperadminCount(this.allUsers);
    }


  //fetches users depending on an internval


  //manuall fetches users depending on given filters
  loadUsers(): void {

    //loading variables will determine if we show a spinning animate or not
    this.isLoading = true;
    //this service method gets our users from backend
    this.userService.getUsers(this.filters.searchId,this.filters.searchQuery,this.filters.selectedRole,this.filters.selectedStatus)
      .subscribe({
        next: (response) => {
          //if we get a response we attach to the variable
          this.allUsers = response.data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.isLoading = false;
        }
      });
  }




//if we leave the component we stop the internval function (so we dont waste memory)
ngOnDestroy(): void {
this.intervalService.stopPolling(this.timerId);
  }

  //users table display section:
  //everytime we show 20 users depending on which page we are
  get totalPages(){
    return Math.ceil(this.totalUsersCount/this.pageSize)
  }
  get paginatedUsers(): UserModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.allUsers.slice(startIndex, startIndex + this.pageSize);
  }

  // Received $event contains the search data emitted by the child
onFiltersApplied(): void {
  this.currentPage = 1;
  this.loadUsers(); // Pass filters to your API call
}

onFiltersReset(): void {
  this.currentPage = 1;
  this.loadUsers(); // Fetch default/unfiltered list
}

recieveFilters(filters:SearchbarFiltersUsers):void{
  this.filters = filters;
}


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

//methods for exporting
  exportMaxLimit:number = 1;
  exportAllUsers:boolean = false;
  exportUsers:UserModel[] = [];
  selectedExportFormat: string = 'pdf';

public handleExport(): void {
    this.isExporting = true;

    if(this.exportAllUsers){
      this.exportMaxLimit = this.totalUsersCount;
    }

    // Slice all users matching current active filters up to the max limit chosen by user
    this.exportUsers = this.allUsers.slice(0, this.exportMaxLimit);

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

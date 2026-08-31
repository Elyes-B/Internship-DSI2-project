import { KeycloakSessions } from './../../models/active-user';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SearchbarUsers } from '../resuable-tools/searchbar-users/searchbar-users';
import { UsersCounter } from '../resuable-tools/users-counter/users-counter';
import { UserService } from '../../services/user';
import { UserModel } from '../../models/user.model';
import { IntervalService } from '../../services/interval-service';
import { SearchbarFiltersUsers } from '../../models/searchbar-filters-users';
import { SearchbarSessions } from '../resuable-tools/searchbar-sessions/searchbar-sessions';
import { SearchFilterSessions } from '../../models/search-filter-sessions';
import { ExportService } from '../../services/export-service';
import { ActiveUserDisplayReport } from '../reports/active-user-display-report/active-user-display-report';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-active-users-display',
  imports: [SearchbarUsers,UsersCounter,SearchbarSessions,ActiveUserDisplayReport,CommonModule,FormsModule],
  templateUrl: './active-users-display.html',
  styleUrl: './active-users-display.css',
})

export class ActiveUsersDisplay implements OnInit,OnDestroy {
  private userService = inject(UserService);
  private intervalService = inject(IntervalService);



  usersFilters:SearchbarFiltersUsers = {
      'searchId':0,
      'searchQuery':'',
      'selectedRole':'',
      'selectedStatus':''
    };

  sessionFilters:SearchFilterSessions = {
    'searchSessionId':'',
    'searchKeycloakId':'',
    'searchUsername':'',
    'searchIpAddress':'',
    'onlyActiveSessions':false
  }

    //used for pagniating the user display table
  currentPage: number = 1;
  pageSize: number = 20;

  //declaring this varaible so that i can use the math methods in html
  public Math = Math;

  timerId:any;
  @ViewChild('export') export!: ElementRef<HTMLElement>;
  activeTab: 'keycloak' | 'database' = 'keycloak';
  isLoading: boolean = true;
  isExporting: boolean = false;
  private exportService = inject(ExportService);

  // Table Data Arrays
  keycloakSessions: KeycloakSessions[] = [];
  databaseUsers: UserModel[] = [];

  ngOnInit(): void {
    this.timerId = this.intervalService.startPolling(()=>this.loadData(),60000);

  }

  ngOnDestroy(): void {
    this.intervalService.stopPolling(this.timerId);
  }

  // Method Stubs
  switchTab(tab: 'keycloak' | 'database'): void {
    this.activeTab = tab;
  }


  loadData(): void {
    this.isLoading = true;
    this.loadKeycloakSessions();
    this.isLoading = false;
  }

loadKeycloakSessions(){

this.userService.getKeycloakActiveUsers(
  this.sessionFilters.searchSessionId,
  this.sessionFilters.searchKeycloakId,
  this.sessionFilters.searchUsername,
  this.sessionFilters.searchIpAddress,
  this.sessionFilters.onlyActiveSessions
).subscribe(
      {
        next:(response)=>{
          this.filterKeyCloakSessions(response.data);
        }
      }
    )

}

filterKeyCloakSessions(keycloakSessions: KeycloakSessions[]): void {
    let filteredSessions: KeycloakSessions[] = [];
    this.userService.getUsers(
      this.usersFilters.searchId,
      this.usersFilters.searchQuery,
      this.usersFilters.selectedRole,
      this.usersFilters.selectedStatus
    ).subscribe({
      next: (response) => {
        console.log(response.data);
        let users = response.data;
        users.forEach(user => {
          keycloakSessions.forEach(session => {
            if (session.username == user.username) {
              filteredSessions.push(session);
            }
          });
        });

        // Store filtered sessions
        this.keycloakSessions = filteredSessions;

        // Trigger next steps ONLY after filtering is finished
        let usernames = this.getAllUsernamesFromSessions();
        this.loadDbUsers(usernames);
      }
    });
  }

  loadDbUsers(usernames:string[]): void {
    console.log(usernames)
    this.userService.getDbActiveUsersFromUsernames(usernames).subscribe(
      {
        next:(response)=>{
          this.databaseUsers = response.data;
          console.log(this.databaseUsers);
        }
      }
    )

  }

  getAllUsernamesFromSessions():string[]{
    let usernames:string[] = [];
    this.keycloakSessions.forEach(session => {
      usernames.push(session.username)
    });
    console.log('usernames'+usernames)
    return usernames;
  }

  get totalUsersCount(){
      return this.userService.totalUsersCount(this.databaseUsers);
    }
    get totalAdminCount(){
      return this.userService.totalAdminCount(this.databaseUsers);
    }
    get totalSuperadminCount(){
      return this.userService.totalSuperadminCount(this.databaseUsers);
    }

  // Received $event contains the search data emitted by the child
onFiltersApplied(): void {
  this.currentPage = 1;
  this.loadData(); // Pass filters to your API call
}

onFiltersReset(): void {
  this.currentPage = 1;
  this.loadData(); // Fetch default/unfiltered list
}

recieveFilters(filters:SearchbarFiltersUsers):void{
  this.usersFilters = filters;
}

recieveSessionFilters(filters:SearchFilterSessions):void{
this.sessionFilters = filters;
}

get currentActiveList(): any[] {
    return this.activeTab === 'keycloak' ? this.keycloakSessions : this.databaseUsers;
  }

  // Returns current paginated slice for loading/empty state checks
  get currentPaginatedItems(): any[] {
    return this.activeTab === 'keycloak' ? this.paginatedKeycloakSessions : this.paginatedUsers;
  }

  get totalPages(): number {
    return Math.ceil(this.currentActiveList.length / this.pageSize) || 0;
  }

  get paginatedUsers(): UserModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.databaseUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get paginatedKeycloakSessions(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.keycloakSessions.slice(startIndex, startIndex + this.pageSize);
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
  exportSessions:KeycloakSessions[] = [];
  selectedExportFormat: string = 'pdf';

public handleExport(): void {
    this.isExporting = true;

    if(this.exportAllUsers && this.activeTab == 'database'){
      this.exportMaxLimit = this.totalUsersCount;
    }
    else if(this.exportAllUsers && this.activeTab == 'keycloak'){
      this.exportMaxLimit = this.keycloakSessions.length;
    }

    // Slice all users matching current active filters up to the max limit chosen by user
    this.exportUsers = this.databaseUsers.slice(0, this.exportMaxLimit);
    this.exportSessions = this.keycloakSessions.slice(0, this.exportMaxLimit);

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

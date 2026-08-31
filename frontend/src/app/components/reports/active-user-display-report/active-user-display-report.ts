import { KeycloakSessions } from './../../../models/active-user';
import { Component, Input } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { SearchbarFiltersUsers } from '../../../models/searchbar-filters-users';
import { SearchFilterSessions } from '../../../models/search-filter-sessions';

@Component({
  selector: 'app-active-user-display-report',
  imports: [],
  templateUrl: './active-user-display-report.html',
  styleUrl: './active-user-display-report.css',
})
export class ActiveUserDisplayReport {
  // each report page will the list of info to display alongisde the filters used to fetch those info
  today = new Date().toString();
  @Input() users: UserModel[] = [];
  @Input() keycloakSessions: KeycloakSessions[] = [];
  @Input() usersFilters: SearchbarFiltersUsers = {
    'searchId':0,
      'searchQuery':'',
      'selectedRole':'',
      'selectedStatus':''
  }
  @Input() sessionFilters:SearchFilterSessions = {
      'searchSessionId':'',
      'searchKeycloakId':'',
      'searchUsername':'',
      'searchIpAddress':'',
      'onlyActiveSessions':false
    }
  // we use this variable to determine which table to export, either keyclock or db sessions
  @Input() reportMode:string = 'keycloak';

}

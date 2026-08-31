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
  @Input() reportMode:string = 'keycloak';

}

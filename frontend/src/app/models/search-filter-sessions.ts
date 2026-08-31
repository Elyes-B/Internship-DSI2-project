// each filter has its own model
export interface SearchFilterSessions {
    searchSessionId:string;
  searchKeycloakId:string;
  searchUsername:string;
  searchIpAddress:string;
  onlyActiveSessions:boolean;
}

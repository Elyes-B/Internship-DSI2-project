// each filter has its own model
export interface SearchFilterLogs {
  id:number;
  userId:string;
  username:string;
  ipAddress:string;
  controllerMethod:string;
  actionType:string;
  startDate:string;
  endDate:string;
}

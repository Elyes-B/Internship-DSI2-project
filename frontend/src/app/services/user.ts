import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { KeycloakSessions } from '../models/active-user';
import { UserLog } from '../models/user-log';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  // Base URL pointing to your CodeIgniter API
  private apiUrl = 'http://localhost:8080/api/users';

  /**
   * Fetch users from CodeIgniter with optional search, role, and status filters.
   */
  getUsers(id:number = 1,search: string = '', role: string = '', status: string = ''): Observable<ApiResponse<UserModel[]>> {
    let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    }

    // Attach search query if provided
    if (search) {
      params = params.set('search', search.trim());
    }

    // Attach role filter if provided
    if (role) {
      params = params.set('role', role);
    }

    // Attach status filter if provided
    if (status) {
      params = params.set('status', status);
    }

    // Sends GET http://localhost:8080/api/users?search=...&role=...&status=...
    return this.http.get<ApiResponse<UserModel[]>>(this.apiUrl, { params });
  }

  //this method is used to get active users with a valid current session
  getKeycloakActiveUsers(id:string,userId:string,username:string,ipAddress:string,onlyActiveSessions:boolean){
    let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    }

    // Attach search query if provided
    if (userId) {
      params = params.set('userId', userId);
    }

    // Attach role filter if provided
    if (username) {
      params = params.set('username', username);
    }

    // Attach status filter if provided
    if (ipAddress) {
      params = params.set('ipAddress', ipAddress);
    }

    if(onlyActiveSessions){
      params = params.set('onlyActiveSessions', onlyActiveSessions);
    }
    let url = this.apiUrl + '/active/keycloak';
    return this.http.get<ApiResponse<KeycloakSessions[]>>(url,{params});
  }

  getDbActiveUsersFromUsernames(usernames:string[]){
    let url = this.apiUrl + '/active/db';

    return this.http.post<ApiResponse<UserModel[]>>(url,{usernames});
  }

  //related to users counters depending on role:
  public totalUsersCount(allUsers:UserModel[]){
        return allUsers.length;
      }
  public totalAdminCount(allUsers:UserModel[]){
        return this.roleCount(allUsers,'admin');
      }
  public totalSuperadminCount(allUsers:UserModel[]){
        return this.roleCount(allUsers,'superadmin');
      }

      public roleCount(allUsers:UserModel[],role: string): number {
        let counter: number = 0;
        allUsers.forEach(user => {
          if (user.role == role){
            counter++;
          }
        });
        return counter;
      }

  public getUserLogs(id:number,userId:string,username:string,ipAddress:string,controllerMethod:string,actionType:string,startDate:string,endDate:string){
  let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    }

    // Attach search query if provided
    if (userId) {
      params = params.set('userId', userId);
    }

    // Attach role filter if provided
    if (username) {
      params = params.set('username', username);
    }

    // Attach status filter if provided
    if (ipAddress) {
      params = params.set('ipAddress', ipAddress);
    }

    if(controllerMethod){
      params = params.set('controller_method', controllerMethod);
    }

    if(actionType){
      params = params.set('action_type', actionType);
    }

    if(startDate){
      params = params.set('startDate', startDate);
    }

    if(endDate){
      params = params.set('endDate', endDate);
    }
    let url = this.apiUrl + '/logs';
    return this.http.get<ApiResponse<UserLog[]>>(url,{params});
  }

}

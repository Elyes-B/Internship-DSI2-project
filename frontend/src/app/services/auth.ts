
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { ApiResponse } from '../models/api-response.model';
import { KeycloakSessions } from '../models/active-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Base URL pointing to your CodeIgniter API
  private apiUrl = 'http://localhost:8080/api/users';
  // Keycloak instance pointing to your Keycloak container
  private keycloak: Keycloak = new Keycloak({
    url: 'http://localhost:8180',
    realm: 'internship-app',
    clientId: 'frontend-angular'
  });

  // Initializes Keycloak during application boot
  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required', // Forces redirect to login page for unauthenticated visitors
        checkLoginIframe: false   // Keeps setup clean without needing extra iframe assets
      });


      if(authenticated){
        this.syncSessionToBackend();
      }
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }


  }

syncSessionToBackend(){
  let sessionInfo:any;
  let tokenParsed = this.keycloak.tokenParsed as any;
  let sessionId = tokenParsed.sid;
  let url = this.apiUrl + '/session?id=' + sessionId
  console.log("authenticating");

  let sessionResponse =  this.http.get<ApiResponse<KeycloakSessions>>(url);

  sessionResponse.subscribe({
    next:(response)=>{
      sessionInfo = response.data;
      let session:KeycloakSessions = {
    'id': sessionInfo.id,
    'userId':sessionInfo.userId,
    'username':sessionInfo.username,
    'ipAddress':sessionInfo.ipAddress,
    'start':sessionInfo.start,
    'lastAccess':sessionInfo.lastAccess
  }

  console.log(session);

  url = this.apiUrl + '/session';

  this.http.post<ApiResponse<KeycloakSessions>>(url,session).subscribe();
    }
  })

}



  // Getters for user details
  isLoggedIn(): boolean {
    return this.keycloak.authenticated;
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getToken(): string|undefined{
    return this.keycloak.token;
  }

  // Action methods
  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  hasRole(roles: Array<string>): boolean {
    let result: boolean = false;
    roles.forEach(role => {
      if (this.keycloak.hasRealmRole(role)){
        result = true;
      }
    });
    return result;
  }
}

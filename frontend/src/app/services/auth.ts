
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
  // base url of the backend api
  private apiUrl = 'http://localhost:8080/api/users';
  // creating an instance object of keycloak
  private keycloak: Keycloak = new Keycloak({
    url: 'http://localhost:8180', //url of keycloak
    realm: 'internship-app', // name of the realm the application is using
    clientId: 'frontend-angular' // the name of the frontend client responsible for authentification
  });

  // intialized application when the frontend boots (requires me to register it in the config file to work)
  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required', // when a user tries to visit a page without authentification it automatically redirects them to the login page
        checkLoginIframe: false
      });

      // when the users authenticates we save his session data in the db
      if(authenticated){
        this.syncSessionToBackend();
      }
      // returns a boolean which determines if the user is authenticated or not
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }


  }

// saves the user session in the db using the keycloak token
syncSessionToBackend(){
  let sessionInfo:any;
  let tokenParsed = this.keycloak.tokenParsed as any; //as any is required otherwise the compiler will complain that the variable could possible be undefined error
  let sessionId = tokenParsed.sid; //session id
  // the request will be a get request where the session id will be passed as a parameter, the backend will be responsible for fetching the session info
  let url = this.apiUrl + '/session?id=' + sessionId
  // console log message i used for debugging, now no longer needed
  //console.log("authenticating");

  //the way requests work in my  project is that i inject the httpclient module, and provide it with a model that i created caled apiresponse which also contains a data variable that accepts any model
  // passed to it as parameter, meaning to fetch the result of the response we need to access the .data variable inside the response
  let sessionResponse =  this.http.get<ApiResponse<KeycloakSessions>>(url);

  //the subscribe method sends the data to the backend and awaits the responsible in the nextL(response) where response contains the data variable we disucssed earlier
  sessionResponse.subscribe({
    next:(response)=>{
      sessionInfo = response.data; //as i said the data is stored in the .data variable according to the APIResponse module i created
      let session:KeycloakSessions = {
    'id': sessionInfo.id, //session id
    'userId':sessionInfo.userId, //user id(different than db userid this is keycloak userid)
    'username':sessionInfo.username, //username
    'ipAddress':sessionInfo.ipAddress, //ip address
    'start':sessionInfo.start, // when the session started
    'lastAccess':sessionInfo.lastAccess //  and last time  he authenticated
  }

  console.log(session);

  //afterwards we will send a post request to save the session in  the  db
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

  // Action methods(mainly for the navbar)
  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  //checks if an authenticated client has a specific role(used for role guarding to only allow admins and superadmins to access the pages)
  hasRole(roles: Array<string>): boolean {
    let result: boolean = false;
    // iterates around the roles of the authenticated user and searches for a match
    roles.forEach(role => {
      if (this.keycloak.hasRealmRole(role)){
        result = true;
      }
    });
    return result;
  }
}

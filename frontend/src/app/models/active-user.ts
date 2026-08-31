export interface KeycloakSessions {
  id: string;          // Keycloak Session ID
  userId: string;      // Keycloak User UUID
  username: string;
  ipAddress: string;
  start: number;       // when logged in
  lastAccess: number;  // last time logged in
  clients?: Record<string, string>; //the clients the user registered with(expected to be frontend-angular)
  rememberMe?: boolean; // if the user clicked on remember me when logging in
}

//sessions model
export interface KeycloakSessions {
  id: string;          // Keycloak Session ID
  userId: string;      // Keycloak User UUID
  username: string;
  ipAddress: string;
  start: number;       // when logged in
  lastAccess: number;  // last time logged in
  // the last 2 are options since it didnt  use them for display, but i added them so this model matches the keycloak active sessions output
  clients?: Record<string, string>; //the clients the user registered with(expected to be frontend-angular)
  rememberMe?: boolean; // if the user clicked on remember me when logging in
}

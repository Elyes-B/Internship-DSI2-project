# Introduction  

first of all i would like to apologise for delay, the reason why it took me so long to finish the project is because i had to learn many new things before i start working on which are :

- docker
- angulard
- keycloak
- code igniter
- typescript

i have ran into many errors when working with those technologies which took a long time to debug and solve
  
this project is an internship project requested by the AMA business team, the original email sent by the AMA team requested the following features:  

## Functional specifications
  
- Displaying the list of users.  
- Viewing connection history (date, time, IP address, browser, operating system, connection status).  
- Viewing currently active sessions.  
- Recording and viewing of actions performed by each user (creation, modification, deletion, viewing, authentication, logout, etc.).  
- Option to filter logs by:  
	- User ;  
	- Date or period;  
	- Type of action;  
	- Platform module.  
	- Quick search in newspapers.  
	- Export logs in Excel or PDF format.  
	- Interface accessible only to Administrator and Super Administrator profiles.
## Technical constraints (CodeIgniter)

- Development compliant with CodeIgniter's MVC architecture.
- Using existing tables ( `user` ) and creating the necessary tables for logging ( `user_logs` , `user_sessions` or equivalent).
- Automatic recording of each important action via Hooks, Libraries or Middleware adapted to CodeIgniter.
- The minimum information recorded must include:
    - User ID;
    - Username;
    - Date and time;
    - IP address;
    - URL requested;
    - Controller and method called;
    - Type of action;
    - Description of the action;
    - Browser (User-Agent);
    - Session ID.

besides what all of those specifications, there are a couple of things that i also added which were not mentioned in this emails which are:

- authentication system with  keycloak
- docker containers
- i used angular framework for the frontend
  
# How does the project work?

## Keycloak

keycloak is responsible for:
- automating the process of login and  logout using JWT authentification
- applying roles and guarding the routes with them
- store a list of admins and superadmins (normal users are excluded)
- fetch all the active sessions
- provides the authenticated user token via an interceptor

## angular

angular is responsible for:
- display
- sending requests to the backend and applying their data for display
- initalizes keycloak
- interceptes every request with a user token
- offers pdf and excel exports for every page

## Codeigniter

- manages the db with sessions, models and entities
- receives requests from the frontend and provide data from either the db or keycloak
- saves admins and super admins in keycloak users tables and controls their permissions
- protectes backend routes by verifying roles
- saves every session and every action in new tables (users_session and users_log)

# Conclusion

this project has taught me alot about web development from building fully centrazlied project with docker to applying secure authentification and role management with keycloak, im very thankful for this opportunity and which the best to the ama business team.

and again sorry for the delay, i wanted to use this internship project as a learning oppotunity and learn many new technologies and apply them to the project

- ilyes belkahia
- ilyesbelkahia22@gmail.com
-  2eme anne etudiant iset bizerte
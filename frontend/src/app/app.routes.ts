import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { UserDisplay } from './components/user-display/user-display';
import { ActiveUsersDisplay } from './components/active-users-display/active-users-display';
import { UserLogsDisplay } from './components/user-logs-display/user-logs-display';

export const routes: Routes = [

{
path:'admin',
canActivate:[authGuard,roleGuard],
data:{
  roles:['admin','superadmin']
},
children:[
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users'
      },
      {
        path: 'users',
        component: UserDisplay
      },
      {
        path:'sessions',
        component: ActiveUsersDisplay
      },
      {
        path:'logs',
        component: UserLogsDisplay
      }
]
}
];

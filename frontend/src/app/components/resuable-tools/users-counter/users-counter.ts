import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-users-counter',
  imports: [],
  templateUrl: './users-counter.html',
  styleUrl: './users-counter.css',
})
export class UsersCounter {
  // displays the counts of admins,users and superadmins by receiving them from parent component
  @Input() allUsersCounter:number|null = null;
  @Input() allAdminsCounter:number|null = null;
  @Input() allSuperAdminsCounter:number|null = null;

}

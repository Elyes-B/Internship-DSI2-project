import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-user-display-report',
  imports: [CommonModule],
  templateUrl: './user-display-report.html',
  styleUrl: './user-display-report.css',
})
export class UserDisplayReport {
  @Input() users: UserModel[] = [];
  @Input() id:number = 1;
  @Input() searchQuery:string = '';
  @Input() selectedRole:string = 'user';
  @Input() selectedStatus:string = 'Active';
}

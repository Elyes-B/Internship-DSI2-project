import { Component, Input } from '@angular/core';
import { UserLog } from '../../../models/user-log';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-logs-display-report',
  imports: [CommonModule],
  templateUrl: './user-logs-display-report.html',
  styleUrl: './user-logs-display-report.css',
})
export class UserLogsDisplayReport {
  // each report page will the list of info to display alongisde the filters used to fetch those info
  @Input() logs: UserLog[] = [];
  @Input() id: number = 0;
  @Input() userId: string = '';
  @Input() username: string = '';
  @Input() ipAddress: string = '';
  @Input() controllerMethod: string = '';
  @Input() actionType: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';
}

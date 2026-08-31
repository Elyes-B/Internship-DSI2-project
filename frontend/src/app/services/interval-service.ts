import { Injectable } from '@angular/core';
import { interval, startWith, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// this service is used always execute methods depending on a time internval, useful for when the data updates
export class IntervalService {
  //this method takes an interval and a time in miliseconds where the method executes at the start and in interval depending on the passed time
  startPolling(action: () => void, timeInMiliseconds: number = 60): any {
    // we first run the method immedialty
    action();


    // afterwards we run the method in interval and save the interval id so that we can terminate the method when we want to
    const timerId = setInterval(() => {
      action();
    }, timeInMiliseconds);

    return timerId;
  }

  //takes the interval id and stops the method so it doesnt waste resources
  stopPolling(timerId: any): void {
    clearInterval(timerId);
  }
}

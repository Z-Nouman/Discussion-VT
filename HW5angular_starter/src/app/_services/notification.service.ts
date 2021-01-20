import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) {}

  public showNotif(message, action = 'error', duration = 4000): void {
    this.snackBar.open(message, action, { duration }).onAction().subscribe(() => {
      // Notification was given
    });
  }

  // Used for features not implemented during development
  // public notImplementedWarning(message, duration = 4000): void {
  //
  //   // @ts-ignore
  //   this.snackBar.open(`"${message}" is not implemented`, 'error', { duration }).onAction().subscribe(() => {
  //   });
  // }



}


import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private readonly snackBar: MatSnackBar) { }

  open(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['snackbar-accent-color-text'],
    });
  }
}

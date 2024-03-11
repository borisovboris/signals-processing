import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SnackbarStyle {
  duration?: number;
  panelClasses?: string[];
}

export const DEFAULT_SNACKBAR_STYLE: SnackbarStyle = {
  duration: 3000,
  panelClasses: ['snackbar-accent-color-text'],
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private readonly snackBar: MatSnackBar) { }

  open(message: string, style: SnackbarStyle = DEFAULT_SNACKBAR_STYLE) {
    this.snackBar.open(message, undefined, {
      duration: style.duration,
      panelClass: style.panelClasses,
    });
  }
}

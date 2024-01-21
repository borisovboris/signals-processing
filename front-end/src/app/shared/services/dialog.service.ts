import { Injectable, Injector } from '@angular/core';
import { Overlay, ComponentType } from '@angular/cdk/overlay';
import { DialogReference } from './dialog-reference';

import { InjectionToken } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { take } from 'rxjs';

export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');

export interface DialogConfig {
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>(component: ComponentType<T>, config?: DialogConfig) {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'overlay-panel',
      disposeOnNavigation: true,
    });

    overlayRef
      .backdropClick()
      .pipe(take(1))
      .subscribe(() => overlayRef.dispose());

    const dialogRef = new DialogReference(overlayRef);

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: DialogReference, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: config?.data },
      ],
    });

    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    return dialogRef;
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { fadeIn } from '../shared/animations';
import { MaterialModule } from '../material/material.module';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordRegx } from '../shared/auth-utils';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth/auth.actions';
import { RouterModule } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  map,
  of,
  switchMap,
} from 'rxjs';
import { AuthService } from '../../../generated-sources/openapi';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  animations: [fadeIn],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  uniqueUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) =>
      control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          return this.authService.checkIfUsernameExists(value);
        }),
        map((exists) => {
          if (exists) {
            return { exists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      );
  }

  constructor(
    private readonly store: Store,
    private readonly authService: AuthService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  hide = true;
  readonly form = new FormGroup({
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(3),
      ],
      asyncValidators: [this.uniqueUsernameValidator()],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.pattern(passwordRegx)],
      nonNullable: true,
    }),
  });

  get username() {
    return this.form['controls']['username'];
  }

  get password() {
    return this.form['controls']['password'];
  }

  get formPending() {
    return this.form.pending;
  }

  registerUser() {
    this.store.dispatch(
      AuthActions.registerUser({
        user: { username: this.username.value, password: this.password.value },
      })
    );
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeIn } from '../shared/animations';
import { MaterialModule } from '../material/material.module';
import {
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
  constructor(private readonly store: Store) {}

  readonly form = new FormGroup({
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(3),
      ],
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

  registerUser() {
    this.store.dispatch(
      AuthActions.registerUser({
        user: { username: this.username.value, password: this.password.value },
      })
    );
  }
}

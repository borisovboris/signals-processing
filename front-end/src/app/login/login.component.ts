import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { AuthActions } from '../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  constructor(private readonly store: Store) {}

  readonly form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      nonNullable: true,
    }),
  });

  get username() {
    return this.form['controls']['username'];
  }

  get password() {
    return this.form['controls']['password'];
  }

  login() {
    this.store.dispatch(
      AuthActions.loginUser({
        user: { username: this.username.value, password: this.password.value },
      })
    );
  }
}

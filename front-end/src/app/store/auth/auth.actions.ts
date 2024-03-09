import { createActionGroup, props } from '@ngrx/store';
import { UserDTO } from '../../../../generated-sources/openapi';

export const AuthActions = createActionGroup({
  source: 'Event',
  events: {
    'Register user': props<{ user: UserDTO }>(),
    'User registered': props<any>(),
    'Login user': props<{ user: UserDTO }>(),
    'User logged': props<{ token: string }>(),
  },
});

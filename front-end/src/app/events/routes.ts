import { Route } from '@angular/router';
import { EventsComponent } from './events.component';
import { provideState } from '@ngrx/store';
import { eventReducer } from '../store/event/event.reducer';
import { provideEffects } from '@ngrx/effects';
import { EventEffects } from '../store/event/event.effects';
import { EventListComponent } from './event-list/event-list.component';

export const EVENT_ROUTES: Route[] = [
  {
    path: '',
    component: EventsComponent,
    providers: [
        // TODO move name of state to a constant
      provideState({ name: 'eventState', reducer: eventReducer }),
      provideEffects([EventEffects]),
    ],
    children: [{ path: '', component: EventListComponent }],
  },
];

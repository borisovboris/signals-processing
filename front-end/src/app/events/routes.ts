import { Route } from '@angular/router';
import { EventsComponent } from './events.component';
import { provideState } from '@ngrx/store';
import { eventReducer } from '../store/event/event.reducer';
import { provideEffects } from '@ngrx/effects';
import { EventEffects } from '../store/event/event.effects';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EVENT_STATE } from '../store/state';

export const EVENT_ROUTES: Route[] = [
  {
    path: '',
    component: EventsComponent,
    providers: [
      provideState({ name: EVENT_STATE, reducer: eventReducer }),
      provideEffects([EventEffects]),
    ],
    children: [
      { path: '', component: EventListComponent },
      { path: 'details', component: EventDetailsComponent },
    ],
  },
];

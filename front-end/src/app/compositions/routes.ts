import { Route } from '@angular/router';
import { AppRoute } from '../routing/routing.model';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CompositionsComponent } from './compositions.component';
import { CompositionsListComponent } from './compositions-list/compositions-list.component';
import { compositionReducer } from '../store/composition/composition.reducer';
import { CompositionEffects } from '../store/composition/composition.effects';
import { CompositionDetailsComponent } from '../composition-details/composition-details.component';
import { COMPOSITION_STATE } from '../store/state';

export const COMPOSITIONS_ROUTES: Route[] = [
  {
    path: '',
    component: CompositionsComponent,
    providers: [
      provideState({ name: COMPOSITION_STATE, reducer: compositionReducer }),
      provideEffects([CompositionEffects]),
    ],
    children: [
      { path: '', component: CompositionsListComponent },
      { path: 'details', component: CompositionDetailsComponent },
    ],
  },
];

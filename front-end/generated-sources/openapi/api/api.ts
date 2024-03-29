export * from './auth.service';
import { AuthService } from './auth.service';
export * from './compositions.service';
import { CompositionsService } from './compositions.service';
export * from './countries.service';
import { CountriesService } from './countries.service';
export * from './events.service';
import { EventsService } from './events.service';
export const APIS = [AuthService, CompositionsService, CountriesService, EventsService];

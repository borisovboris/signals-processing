export * from './compositions.service';
import { CompositionsService } from './compositions.service';
export * from './countries.service';
import { CountriesService } from './countries.service';
export * from './signals.service';
import { SignalsService } from './signals.service';
export const APIS = [CompositionsService, CountriesService, SignalsService];

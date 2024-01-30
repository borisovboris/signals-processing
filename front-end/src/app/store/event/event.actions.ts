import { createActionGroup, props } from "@ngrx/store";
import { EventDTO } from "../../../../generated-sources/openapi";

export const EventActions = createActionGroup({
    source: 'Event',
    events: {
        'Get Events': props<any>(),
        'Events fetched': props<{ events: EventDTO[] }>()
    }
})
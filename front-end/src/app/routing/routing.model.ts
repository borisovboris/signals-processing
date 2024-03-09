export enum AppRoute {
    COUNTRIES = 'countries',
    COMPOSITIONS = 'compositions',
    EVENTS = 'events',
}

export const routePaths = Object.values(AppRoute);

export function isRoute(input: any): input is AppRoute {
    return routePaths.includes(input);
}
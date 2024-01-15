export enum AppRoute {
    HOME = 'home',
    COUNTRIES = 'countries',
    DEVICES = 'devices',
    EVENTS = 'events',
}

export function isRoute(input: any): input is AppRoute {
    return Object.values(AppRoute).includes(input);
}
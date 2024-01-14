export enum AppRoute {
    HOME = 'home',
    LOCATIONS = 'locations',
    DEVICES = 'devices',
    EVENTS = 'events',
}

export function isRoute(input: any): input is AppRoute {
    return Object.values(AppRoute).includes(input);
}
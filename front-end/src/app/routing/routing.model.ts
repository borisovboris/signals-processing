export enum ROUTE {
    HOME = '/home',
    LOCATIONS = '/locations',
    DEVICES = '/devices',
    EVENTS = '/events',
}

export function isRoute(input: any): input is ROUTE {
    return Object.values(ROUTE).includes(input);
}
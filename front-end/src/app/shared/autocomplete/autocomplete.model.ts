export interface AutoComplete {
    onUserInput: (arg: string) => void,
    onItemsUpdated: (arg: string[]) => void,
}
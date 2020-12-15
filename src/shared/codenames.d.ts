export interface GameState {
    phase: GamePhase;
    players: Player[];
    language: Language;
    inTurn: TeamColour;

    cards?: Card[] | undefined;
    hint?: Hint | undefined;
}
export interface Player {
    id: string;
    name: string;
    team: TeamColour;

    isHost?: boolean;
    isGameMaster?: boolean;
}
export interface Hint {
    word: string;
    amount: number;
}
export interface Card {
    content: string;
    colour: TeamColour;
    isConsumed?: boolean;
}
export interface ClientAction {
    action: string;
    data: any;
}

export const enum TeamColour {
    White = "white",
    Black = "black",
    Red = "red",
    Blue = "blue"
}
export const enum GamePhase {
    Lobby = "lobby",
    Round = "round",
    Over = "over"
}
export const enum Language {
    German = "de",
    English = "en"
}
export const enum CurrentAction {

}
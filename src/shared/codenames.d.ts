/**
 * Represents the current state of the game.
 */
export interface GameState {
    phase: GamePhase;
    players: Player[];
    language: Language;
    inTurn: TeamColour;

    cards?: Card[] | undefined;
    hint?: Hint | undefined;
}
/**
 * Represents a player in an instance of the game.
 */
export interface Player {
    id: string;
    name: string;
    team: TeamColour;

    isHost?: boolean;
    isGameMaster?: boolean;
}
/**
 * Represents a hint that is used to guess words in the game.
 */
export interface Hint {
    word: string;
    amount: number;
}
/**
 * Represents a card in the game. Cards have a content and a colour, and can be consumed/picked.
 */
export interface Card {
    content: string;
    colour: TeamColour;
    isConsumed?: boolean;
}

/**
 * Represents an action invoked by a client, passed to the server.
 * The type of the action is specified via a string, and the data can be anything serializeable.
 */
export interface ClientAction {
    action: string;
    data: any;
}

/**
 * Represents the potential team colours.
 * Note that only Red and Blue can actually be obtained by teams, the others are used for the cards.
 */
export const enum TeamColour {
    White = "white",
    Black = "black",
    Red = "red",
    Blue = "blue"
}
/**
 * Represents the current phase of the game.
 */
export const enum GamePhase {
    Lobby = "lobby",
    Round = "round",
    Over = "over"
}
/**
 * Represents a language in the game.
 */
export const enum Language {
    German = "de",
    English = "en"
}
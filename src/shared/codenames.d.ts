/**
 * Represents the current state of the game.
 */
export interface GameState {
    id: string;
    /**
     * The index of the current round, starting at 0 for the first round.
     */
    round: number;
    /**
     * The current phase of the game. Lobby at the start.
     */
    phase: GamePhase;
    /**
     * The players inside the game.
     */
    players: Player[];
    /**
     * The language to be used in the game.
     */
    language: Language;
    /**
     * The team that is currently in turn.
     */
    inTurn: TeamColour;
    
    /**
     * The cards on the card grid. Generated new each round.
     */
    cards?: Card[] | undefined;
    /**
     * The hint sent from the game master. Reset to null after a turn is ended.
     */
    hint?: Hint | null;

    /**
     * The history of hints sent from the game masters. Also includes the current hint.
     */
    hintHistory: Hint[];
    /**
     * The history of winners. Can be used to track how many times a team has won.
     */
    winnerHistory: TeamColour[];
}

export interface JoinGameOptions {
    name: string;
    gameId: string;
}
export interface CreateGameOptions extends JoinGameOptions {
    language: Language;
}

/**
 * Represents a player in an instance of the game.
 */
export interface Player {
    /**
     * The socket ID of the player.
     */
    id: string;
    /**
     * The publicly visible username of the player.
     */
    name: string;
    /**
     * The team that the player is in.
     */
    team: TeamColour;

    /**
     * Is the player a game host?
     */
    isHost?: boolean;
    /**
     * Is the player a game master?
     */
    isGameMaster?: boolean;
    /**
     * Is the player disconnected and trying to reconnect?
     */
    isReconnecting?: boolean;
}

/**
 * Represents a hint that is used to guess words in the game.
 */
export interface Hint {
    /**
     * The word of the hint.
     */
    word: string;
    /**
     * The amount of cards the hint refers to.
     */
    amount: number;
    /**
     * The colour of the team that the hint refers to.
     */
    team: TeamColour;
}

/**
 * Represents a card in the game. Cards have a content and a colour, and can be consumed/picked.
 */
export interface Card {
    /**
     * The word that is displayed on the card.
     */
    content: string;
    /**
     * The colour that the card belongs to. Can be a team, blank or an assassin.
     */
    colour: TeamColour;
    /**
     * Was the card already consumed?
     */
    isConsumed?: boolean;
}

/**
 * Represents an action invoked by a client, passed to the server.
 * The type of the action is specified via a string, and the data can be anything serializeable.
 */
export interface ClientAction {
    /**
     * The type of the action.
     */
    action: string;
    /**
     * The data passed to the action.
     */
    data: any;
}

/**
 * Represents the potential team colours.
 * Note that only Red and Blue can actually be obtained by teams, the others are used for the cards.
 */
export const enum TeamColour {
    /**
     * Represents a blank team.
     */
    White = "white",
    /**
     * Represents the the assassin.
     */
    Black = "black",
    /**
     * Represents the red team.
     */
    Red = "red",
    /**
     * Represents the blue team.
     */
    Blue = "blue"
}

/**
 * Represents the current phase of the game.
 */
export const enum GamePhase {
    /**
     * During this phase, players need to organize themselves into their teams.
     */
    Lobby = "lobby",
    /**
     * During this phase, players take turns in providing hints and guessing cards.
     * This goes on until a team found all their cards or a team picked the assassin.
     */
    Round = "round",
    /**
     * During this phase the only possible action is for the host to start a new game.
     */
    Over = "over"
}

/**
 * Represents a language in the game.
 */
export const enum Language {
    German = "de",
    English = "en"
}
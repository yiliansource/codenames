import chalk from "chalk";
import { GamePhase, GameState, Language, Player, TeamColour } from "../../shared/codenames";

var game: GameState | undefined = undefined;
var players: Player[] = [];

/**
 * Returns the current game instance.
 * Game IDs are to be added in the future.
 */
export function getGame(): GameState | undefined {
    return game;
}
/**
 * Creates a new game instance.
 * @param host The host of the game.
 */
export function createGame(host: Player): GameState {
    if (getGame() != undefined) {
        throw new Error(`A game was already created.`);
    }

    // Create a new game with default settings. Don't bother adding the host to the players, that step is handled during registration.
    let state: GameState = {
        phase: GamePhase.Lobby,
        language: Language.German,
        inTurn: TeamColour.White,
        players: []
    }

    // Mark the host as host.
    host.isHost = true;
    game = state;

    return state;
}

/**
 * Looks up a player by his ID. Returns undefined if no matching player was found.
 */
export function getPlayer(socketId: string): Player | undefined {
    return players.find(p => p.id == socketId);
}

/**
 * Creates a new player registered onto the given socket ID under the given name.
 * Socket IDs need to be unique, names do not.
 */
export function registerPlayer(socketId: string, name: string): Player {
    if (getPlayer(socketId) != undefined) {
        throw new Error("A player is already registered on socket ID " + socketId + ".");
    }

    let player: Player = {
        id: socketId,
        name: name,
        team: TeamColour.White
    };
    player.toString = (): string => `${player.name} ${chalk.gray`(${player.id})`}`;
    players.push(player);

    return player;
}

/**
 * Unregisters the player from the specified socket ID. Returns false if no player was unregistered.
 */
export function unregisterPlayerId(socketId: string): boolean {
    let index = players.findIndex(p => p.id == socketId);
    if (index >= 0) {
        players.splice(index, 1);
    }
    return index >= 0;
}
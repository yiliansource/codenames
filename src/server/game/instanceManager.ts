import { GamePhase, GameState, Player, TeamColour } from "../../shared/codenames";

var game: GameState | undefined = undefined;
var players: Player[] = [];

export function getGame(): GameState | undefined {
    return game;
}
export function createGame(gameId: string, host: Player): GameState {
    if (getGame() != undefined) {
        throw new Error(`A game was already created.`);
    }

    let state: GameState = {
        phase: GamePhase.Lobby,
        players: []
    }

    host.isHost = true;
    game = state;

    return state;
}

export function getPlayer(socketId: string): Player | undefined {
    return players.find(p => p.id == socketId);
}

export function registerPlayer(socketId: string, name: string): Player {
    if (getPlayer(socketId) != undefined) {
        throw new Error("A player is already registered on socket ID " + socketId + ".");
    }

    let player: Player = {
        id: socketId,
        name: name,
        team: TeamColour.White
    };
    players.push(player);

    return player;
}

export function unregisterPlayerId(socketId: string): boolean {
    let index = players.findIndex(p => p.id == socketId);
    if (index >= 0) {
        players.splice(index, 1);
    }
    return index >= 0;
}
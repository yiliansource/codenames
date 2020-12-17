import * as util from "./gameUtility";
import { createLogger } from "./gameLogger";

import { GamePhase, GameState, Language, Player, TeamColour } from "../../shared/codenames";

const games: GameState[] = [];
const playerGameLookup: { [playerId: string]: string } = {};

/**
 * Returns a game by its ID, or undefined if no game was found.
 * @param id The ID of the game.
 */
export function getGame(id: string): GameState | undefined {
    return games.find(g => g.id === id);
}

/**
 * Returns a game by a player residing inside that game.
 * @param player A player instance inside the game desired to retrieve.
 */
export function getGameByPlayer(player: Player): GameState | undefined {
    return getGame(playerGameLookup[player.id]);
}

/**
 * Creates a new game instance. Throws an error if the ID was already taken.
 * @param id The desired ID of the game.
 * @param host The host of the game.
 * @param language The desired language, used in the UI and on the cards.
 */
export function createGame(id: string, host: Player, language: Language): GameState {
    if (getGame(id) != undefined) {
        throw new Error(`A game with ID '${id}' was already created.`);
    }

    games.push({
        id,
        round: -1,

        phase: GamePhase.Lobby,
        inTurn: TeamColour.White,
        language,

        players: [],
        hintHistory: [],
        winnerHistory: []
    });

    host.isHost = true;

    return joinGame(id, host)!;
}

/**
 * Joins the specified player into the game with the specified ID. Returns the joined game instance, or undefined if no game was found.
 * @param id The ID of the game to join.
 * @param player The player to join into the game.
 */
export function joinGame(id: string, player: Player): GameState | undefined {
    let game = getGame(id);
    if (game != undefined && game.phase === GamePhase.Lobby) {
        playerGameLookup[player.id] = id;

        game.players.push(player);
        // Always try to join the team that has less players, or the red team by default.
        player.team = util.getTeamPlayers(game.players, TeamColour.Red).length <= util.getTeamPlayers(game.players, TeamColour.Blue).length ? TeamColour.Red : TeamColour.Blue;

        createLogger(game).info(`${player} ${player.isHost ? "created" : "joined"} the game!`);
    }
    return game;
}
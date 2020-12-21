import { Server, Socket } from "socket.io";
import chalk from "chalk";

import * as actions from "./actionHandler";
import * as players from "./playerProvider";
import * as games from "./gameProvider";
import * as util from "./gameUtility";
import { createLogger } from "./gameLogger";

import { GameState, CreateGameOptions, JoinGameOptions } from "../../shared/codenames";

/**
 * Initializes the game (Codenames) functionality on the given Socket.IO server.
 */
export function initialize(io: Server) {
    io.on('connection', (client: Socket) => {
        client.once('createGame', (options: CreateGameOptions, callback: (result: GameState | string) => void) => {
            try {
                let player = createPlayerOnSocket(client, io, options.name);
                let game = games.createGame(options.gameId || util.randomGameId(), player, options.language);

                client.join(game.id);
                callback(game);
            }
            catch {
                callback("Something went wrong while trying to create the game.");
            }
        });
        client.once('joinGame', (options: JoinGameOptions, callback: (result: GameState | string) => void) => {
            try {
                let player = createPlayerOnSocket(client, io, options.name);
                let game = games.joinGame(options.gameId, player);

                if (game == undefined) throw game;

                client.join(game.id);
                io.to(game.id).emit('game_state_updated', game);
                callback(game);
            }
            catch {
                callback("Something went wrong while trying to join the game.");
            }
        });

        // Perform a basic attempt at reconnection, checking the player was already in a game previously.
        (function() {
            let player = players.getPlayer(client.id);
            if (player != undefined) {
                let game = games.getGameByPlayer(player);
                if (game != undefined) {
                    player.isReconnecting = false;
                    client.emit('game_state_updated', games.getGameByPlayer(player));

                    createLogger(game).info(`${player} reconnected.`);
                }
            }
        })();

        client.on('disconnect', () => {
            let player = players.getPlayer(client.id);
            if (player != undefined) {
                let game = games.getGameByPlayer(player);
                if (game != undefined) {
                    let logger = createLogger(game);

                    player.isReconnecting = true;
                    logger.warn(`${player} disconnected.`);

                    if (game.players.every(p => p.isReconnecting)) {
                        // All players have disconnected, we can delete the game.
                        games.deleteGame(game.id);
                        logger.warn("All players have left the game, deleting the room.");
                    }
                    else {
                        io.to(game.id).emit('game_state_updated', games.getGameByPlayer(player));
                    }

                }
            }
        });
    });
}

function createPlayerOnSocket(socket: Socket, io: Server, name: string) {
    let player = players.registerPlayer(socket.id, name);
    actions.registerSocket(socket, (game) => io.to(game.id).emit('game_state_updated', game));

    createLogger().info(chalk.green`${player} connected and was registered!`);

    return player;
}
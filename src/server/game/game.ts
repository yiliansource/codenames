import { Server, Socket } from "socket.io";
import chalk from "chalk";

import { GameState, TeamColour, GamePhase } from "./../../shared/codenames";
import * as actions from "./actionHandler";
import * as instances from "./instanceManager";

/**
 * Initializes the game (Codenames) functionality on the given Socket.IO server.
 */
export function initialize(io: Server) {
    io.on('connection', (client: Socket) => {
        client.on('register', (name: string, callback: (state: GameState) => void) => {
            // Register the player into the system. Also, register all the actions onto his sockets.
            let player = instances.registerPlayer(client.id, name);
            actions.registerSocket(client, (game) => io.emit('game_state_updated', game));
            console.log(chalk.green`${player} connected and was registered!`);

            // Place the player into the current game.
            let game = instances.getGame() || instances.createGame(player);
            if (game.phase == GamePhase.Lobby) {
                game.players.push(player);

                // The team colour is determined by the number of players in each team. It tries to balance out the players, preferring red over blue.
                player.team = game.players.filter(p => p.team == TeamColour.Red).length <= game.players.filter(p => p.team == TeamColour.Blue).length
                    ? TeamColour.Red : TeamColour.Blue;

                // The callback tells the registered player that the registration was successful.
                callback(game);
                
                // Lastly, tell the other players that a new player is here (by simply passing the entire game state).
                client.broadcast.emit('game_state_updated', game);
            }
        });
        client.on('disconnect', () => {
            let player = instances.getPlayer(client.id);
            if (player != undefined) {
                console.log(chalk.red`${player} disconnected.`);
            }
            
            // TODO: Properly handle disconnects.
            //if (player != undefined && instances.unregisterPlayerId(player.id)) {
            //    console.log(chalk.red`${player.name} (${chalk.gray(client.id)}) disconnected and was unregistered.`);
            //}
        });
    });
}
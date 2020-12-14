import { Server, Socket } from "socket.io";
import chalk from "chalk";

import { GameState, TeamColour, GamePhase } from "./../../shared/codenames";
//import * as util from "./game-utility";
import * as actions from "./actionHandler";
import * as instances from "./instanceManager";

export function initialize(io: Server) {
    io.on('connection', (client: Socket) => {
        client.on('register', (name: string, callback: (state: GameState) => void) => {
            let player = instances.registerPlayer(client.id, name);
            actions.registerSocket(client);

            console.log(chalk.greenBright`${name} (${chalk.gray(client.id)}) was connected and registered!`);

            let game = instances.getGame() || instances.createGame('', player);
            if (game.phase == GamePhase.Lobby) {
                player.team = game.players.filter(p => p.name == TeamColour.Red).length <= game.players.filter(p => p.name == TeamColour.Blue).length
                    ? TeamColour.Red : TeamColour.Blue;

                game.players.push(player);
                client.broadcast.emit('game_state_updated', game);

                callback(game);
            }
        });
        client.on('disconnect', () => {
            if (instances.unregisterPlayerId(client.id)) {
                console.log(chalk.redBright`${chalk.gray(client.id)} was disconnected and unregistered.`);
            }
        });
    });
}
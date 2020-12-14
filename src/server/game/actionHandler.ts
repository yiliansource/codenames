import { Socket } from "socket.io";
import fs from "fs";
import path from "path";

import { GameState, Player, ClientAction } from "../../shared/codenames";
import * as instances from "./instanceManager";
import chalk from "chalk";

const actions = loadActions();
console.log(chalk.greenBright`${chalk.white(actions.length)} action(s) were loaded!`);

export interface GameAction {
    name: string;
    execute: (caller: Player, game: GameState, data: any) => boolean;
}

export function registerSocket(socket: Socket) {
    socket.on('action', (data: ClientAction) => { executeAction(socket, data); });
}

function loadActions(): GameAction[] {
    let directory = path.join(__dirname, 'actions');
    return fs.readdirSync(directory)
        .map(file => require(path.join(directory, file)));
}

function executeAction(client: Socket, data: ClientAction) {
    let action = actions.find(ac => ac.name == data.action);
    let player = instances.getPlayer(client.id);
    let game = instances.getGame();

    if (action == undefined)
        throw new Error("An action was recieved on a socket, but the action '" + data.action + "' was not found.");
    if (player == undefined)
        throw new Error("An action invokation was attempted, but a registered calling player instance could not be found.");
    if (game == undefined)
        throw new Error("A calling player was found, but the corresponding game instance was undefined.");

    try {
        action.execute(player, game, data);
    }
    catch {
        console.log(chalk.red`Something went wrong while executing the action ${chalk.yellowBright(action.name)} 
            using data ${chalk.yellowBright(JSON.stringify(data))}.`);
    }
}
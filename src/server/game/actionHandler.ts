import { Socket } from "socket.io";
import fs from "fs";
import path from "path";

import { GameState, Player, ClientAction } from "../../shared/codenames";
import * as instances from "./instanceManager";
import chalk from "chalk";

// Load the possible actions once upon module import.
const actions = loadActions();
console.log(chalk.greenBright`${chalk.white(actions.length)} action(s) were loaded!`);

/**
 * Represents an action that can be executed through a client request.
 */
export interface GameAction {
    /**
     * The name of the action. Used in the process of looking up which action the client wanted to invoke.
     */
    name: string;
    /**
     * Executes the action, using the specified contextual values and data.
     * Returns true if the action was successful and posed impact on the game state.
     */
    execute: (caller: Player, game: GameState, data: any) => boolean;
}

/**
 * Registers the action callbacks on the given socket.
 * @param socket The socket to register the actions on.
 * @param onActionExecuted Called if an action was performed successfully, passing the modified game state.
 */
export function registerSocket(socket: Socket, onActionExecuted: (game: GameState) => void) {
    socket.on('action', (data: ClientAction) => { 
        try {
            executeAction(socket.id, data, onActionExecuted);
        }
        catch (error) {
            console.error(chalk.red(error));
        }
    });
}

/**
 * Loads the action definitions from the subdirectory '/actions'.
 */
function loadActions(): GameAction[] {
    let directory = path.join(__dirname, 'actions');
    return fs.readdirSync(directory)
        .map(file => require(path.join(directory, file)).default);
}

/**
 * Executes the given action with the specified client, using the specified data.
 * @param clientId The ID of the client that invoked the action.
 * @param clientAction The data of the action to invoke.
 * @param onActionExecuted Called if an action was performed successfully, passing the modified game state.
 */
function executeAction(clientId: string, clientAction: ClientAction, onActionExecuted: (game: GameState) => void) {
    let gameAction = actions.find(ac => ac.name == clientAction.action);
    let player = instances.getPlayer(clientId);
    let game = instances.getGame();

    if (gameAction == undefined)
        throw new Error("An action was recieved on a socket, but the action '" + clientAction.action + "' was not found.");
    if (player == undefined)
        throw new Error("An action invokation was attempted, but a registered calling player instance could not be found.");
    if (game == undefined)
        throw new Error("A calling player was found, but the corresponding game instance was undefined.");

    try {
        if (gameAction.execute(player, game, clientAction.data)) {
            onActionExecuted(game);
        }
    }
    catch (err) {
        console.error(chalk.red`Something went wrong while executing the action ${chalk.yellowBright(gameAction.name)} using data ${chalk.yellowBright(JSON.stringify(clientAction.data))}.`);
        console.error(chalk.red`    (${err})`);
    }
}
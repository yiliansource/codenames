import { Socket } from "socket.io";
import { GameState, Player, ClientAction } from "../../shared/codenames";
import { GameAction } from "./types";

import * as instances from "./instanceManager";

export function registerAll(socket: Socket) {
    socket.on('action', (data: ClientAction) => {
        let action = allActions.find(a => a.name == data.action);
        let player: Player | undefined = instances.getPlayer(socket.id);
        let game = instances.getGame();

        if (action == undefined)
            throw new Error("An action was recieved on a socket, but the action '" + data.action + "' was not found.");
        if (player == undefined)
            throw new Error("An action invokation was attempted, but a registered calling player instance could not be found.");
        if (game == undefined)
            throw new Error("A calling player was found, but the corresponding game instance was undefined.");

        action.handle(player, game, data);
    });
}

export const NominateCardAction: GameAction = {
    name: "nominateCard",
    handle: (caller: Player, game: GameState, data: any) => {
        console.log(caller.name + " nominated the card " + data.index + "!");
        return true;
    }
}

const allActions: GameAction[] = [
    NominateCardAction
];
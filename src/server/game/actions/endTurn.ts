import chalk from "chalk";

import { GameAction } from "../actionHandler";
import { createGameHandler } from "../gameHandler";

import { GamePhase, GameState, Player } from "../../../shared/codenames";

/**
 * Represents an action that is invoked when a player wants to end their turn.
 */
const EndTurnAction: GameAction = {
    name: "endTurn",
    check: (caller: Player, game: GameState) => game.phase === GamePhase.Round && !caller.isGameMaster && caller.team === game.inTurn,
    execute: (caller: Player, game: GameState) => {
        console.log(chalk.yellow`${caller} ended their team's turn.`);
        createGameHandler(caller, game).advanceTurn();
    }
}
export default EndTurnAction;
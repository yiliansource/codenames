import { GameAction } from "../actionHandler";
import { createGameHandler } from "../gameHandler";
import { createLogger } from "../gameLogger";

import { GamePhase, GameState, Player } from "../../../shared/codenames";

/**
 * Represents an action that is invoked when a player wants to end their turn.
 */
const EndTurnAction: GameAction = {
    name: "endTurn",
    check: (caller: Player, game: GameState) => game.phase === GamePhase.Round && !caller.isGameMaster && caller.team === game.inTurn,
    execute: (caller: Player, game: GameState) => {
        createLogger(game).info(`${caller} ended their teams turn.`);
        createGameHandler(caller, game).advanceTurn();
    }
}
export default EndTurnAction;
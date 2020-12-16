import { GameAction } from "../actionHandler";
import { createGameHandler } from "../gameHandler";

import { GamePhase, GameState, Hint, Player } from "../../../shared/codenames";

/**
 * Represents an action that is executed when a player wants to submit a hint.
 */
const SubmitHintAction: GameAction = {
    name: "submitHint",
    check: (caller: Player, game: GameState, hint: Hint) => game.phase === GamePhase.Round && !!caller.isGameMaster && caller.team === game.inTurn && !!hint,
    execute: (caller: Player, game: GameState, hint: Hint) => createGameHandler(caller, game).submitHint(hint)
}
export default SubmitHintAction;
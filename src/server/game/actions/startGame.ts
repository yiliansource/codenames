import { GameAction } from "../actionHandler";
import { createGameHandler } from "../gameHandler";

import { GamePhase, GameState, Player } from "../../../shared/codenames";

/**
 * Represents an action that is performed when the host(!) wants to start the game.
 */
const StartGameAction: GameAction = {
    name: "startGame",
    check: (caller: Player, game: GameState) => game.phase !== GamePhase.Round && !!caller.isHost,
    execute: (caller: Player, game: GameState) => createGameHandler(caller, game).startRound()
}
export default StartGameAction;
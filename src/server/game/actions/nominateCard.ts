import { GameAction } from "../actionHandler";
import { createGameHandler } from "../gameHandler";

import { GamePhase, GameState, Player } from "../../../shared/codenames";

/**
 * Represents an action that is called when a player wants to nominate a card.
 */
const NominateCardAction: GameAction = {
    name: "nominateCard",
    check: (caller: Player, game: GameState) => game.phase === GamePhase.Round && !!game.hint && !caller.isGameMaster && caller.team === game.inTurn,
    execute: (caller: Player, game: GameState, index: number) => createGameHandler(caller, game).revealCard(index)
}
export default NominateCardAction;
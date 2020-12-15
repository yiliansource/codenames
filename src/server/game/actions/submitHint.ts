import chalk from "chalk";
import { GamePhase, GameState, Hint, Player, TeamColour } from "../../../shared/codenames";
import { GameAction } from "../actionHandler";

/**
 * Represents an action that is executed when a player wants to submit a hint.
 * 
 * Only actually submits the hint if the round is ongoing and the caller is a game master in turn.
 */
const SubmitHintAction: GameAction = {
    name: "submitHint",
    execute: (caller: Player, game: GameState, hint: Hint) => {
        if (game.phase === GamePhase.Round && caller.isGameMaster && caller.team === game.inTurn) {
            game.hint = hint;
            console.log(chalk.green`${caller} submitted a hint: ${chalk.yellow(JSON.stringify(hint))}`);

            return true;
        }
        return false;
    }
}
export default SubmitHintAction;
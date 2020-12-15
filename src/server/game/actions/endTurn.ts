import chalk from "chalk";
import { GamePhase, GameState, Hint, Player, TeamColour } from "../../../shared/codenames";
import { GameAction } from "../actionHandler";

const EndTurnAction: GameAction = {
    name: "endTurn",
    execute: (caller: Player, game: GameState) => {
        if (game.phase === GamePhase.Round && !caller.isGameMaster && caller.team === game.inTurn) {
            game.inTurn = (game.inTurn === TeamColour.Red ? TeamColour.Blue : TeamColour.Red);
            console.log(chalk.yellow`${caller} ended their team's turn.`);

            return true;
        }
        return false;
    }
}
export default EndTurnAction;
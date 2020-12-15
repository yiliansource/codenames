import chalk from "chalk";
import { GamePhase, GameState, Player, TeamColour } from "../../../shared/codenames";
import { GameAction } from "../actionHandler";

/**
 * Represents an action that is called when a player wants to nominate a card.
 * 
 * Performs a check to see if a card can be nominated by the calling player.
 * 
 * Also advances the game progress in case the card can be revealed.
 */
const NominateCardAction: GameAction = {
    name: "nominateCard",
    execute: (caller: Player, game: GameState, index: number) => {
        if (game.phase === GamePhase.Round && game.cards !== undefined && !caller.isGameMaster && caller.team === game.inTurn) {
            console.log(chalk.yellow`${caller} nominated the card ${index} (${game.cards[index].content})`);

            const card = game.cards[index];
            card.isConsumed = true;

            if (card.colour === TeamColour.Black) {
                game.phase = GamePhase.Over;
                console.log(chalk.yellow`   --> Card was an assassin. ${caller.team} lost.`);
            }
            else if (caller.team !== card.colour) {
                game.inTurn = (game.inTurn === TeamColour.Red ? TeamColour.Blue : TeamColour.Red);
                console.log(chalk.yellow`   --> Card was not ${caller.team}. Switching turn to the other team.`);
            }
            else {
                console.log(chalk.yellow`   --> Card was the same colour (${caller.team}), keep guessing!`);
            }

            return true;
        }
        return false;
    }
}
export default NominateCardAction;
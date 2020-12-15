import { GameState, Player } from "../../../shared/codenames";
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
        // TODO: Proper check
        if (game.cards !== undefined) {
            console.log(`${caller} nominated the card ${index} (${game.cards[index].content})`);
            game.cards[index].isConsumed = true;
            return true;
        }
        return false;
    }
}
export default NominateCardAction;
import { GameState, Player } from "../../../shared/codenames";
import { GameAction } from "../actionHandler";

const NominateCardAction: GameAction = {
    name: "nominateCard",
    execute: (caller: Player, game: GameState, data: any) => {
        console.log(caller.name + " nominated the card " + data.index + "!");
        return true;
    }
}
export default NominateCardAction;
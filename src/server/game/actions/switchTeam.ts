import chalk from "chalk";
import { GamePhase, GameState, Player, TeamColour } from "../../../shared/codenames";
import { GameAction } from "../actionHandler";

/**
 * Represents an action that is executed when a player wants to switch teams (only during the lobby phase!).
 * 
 * Also performs the switch, if the request was valid.
 */
const SwitchTeamAction: GameAction = {
    name: "switchTeam",
    execute: (caller: Player, game: GameState, team: TeamColour) => {
        if (game.phase === GamePhase.Lobby) {
            if (team != TeamColour.Red && team != TeamColour.Blue) {
                throw new Error(`Invalid team colour '${team}'.`);
            }

            caller.team = team;
            console.log(chalk.white`${caller} switched to team ${team}.`);

            return true;
        }
        return false;
    }
}
export default SwitchTeamAction;
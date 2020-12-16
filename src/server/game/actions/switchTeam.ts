import { GameAction } from "../actionHandler";
import { createGameHandler } from "../gameHandler";

import { GamePhase, GameState, Player, TeamColour } from "../../../shared/codenames";

/**
 * Represents an action that is executed when a player wants to switch teams (only during the lobby phase!).
 */
const SwitchTeamAction: GameAction = {
    name: "switchTeam",
    check: (caller: Player, game: GameState, team: TeamColour) => game.phase === GamePhase.Lobby && caller.team !== team,
    execute: (caller: Player, game: GameState, team: TeamColour) => createGameHandler(caller, game).switchTeam(team)
}
export default SwitchTeamAction;
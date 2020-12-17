import chalk from "chalk";
import { Player, TeamColour } from "../../shared/codenames";

import * as games from "./gameProvider";

const chalkTeamLookup: { [key in TeamColour]: chalk.Chalk } = {
    [TeamColour.White]: chalk.white,
    [TeamColour.Black]: chalk.gray,
    [TeamColour.Red]: chalk.red,
    [TeamColour.Blue]: chalk.blue
};

/**
 * Ensures that the specified team is either Red or Blue.
 */
export function isProperTeam(team: TeamColour): boolean {
    return team === TeamColour.Red || team === TeamColour.Blue;
}

/**
 * Returns the opposing team. Throws an error if the team does not have an opposite.
 */
export function otherTeam(team: TeamColour): TeamColour {
    if (!isProperTeam(team)) {
        throw new Error(`Team ${team} does not have an opposite team.`);
    }
    return team === TeamColour.Red ? TeamColour.Blue : TeamColour.Red;
}

/**
 * Formats the specified team name, making it uppercase and colouring it.
 */
export function formatTeamName(team: TeamColour): string {
    return chalkTeamLookup[team](team.substr(0, 1).toUpperCase() + team.substr(1));
}

/**
 * Formats the specified player instance, including their name and ID, and colouring the result.
 */
export function formatPlayer(player: Player): string {
    return chalkTeamLookup[player.team]`${player.name} ${chalk.gray`(${player.id.substr(0, 5) + "..."})`}`;
}

/**
 * Returns all team members of the specified team.
 */
export function getTeamPlayers(allPlayers: Player[], team: TeamColour): Player[] {
    return allPlayers.filter(p => p.team === team);
}

/**
 * Returns a random, non-occupied game ID.
 * Game IDs are 3-character-long strings of random uppercase letters.
 */
export function randomGameId(): string {
    let gameId: string;
    const keyspace = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    do {
        gameId = Array(3).fill(0).map(() => keyspace[Math.floor(Math.random() * keyspace.length)]).join('');
    } while (games.getGame(gameId) != undefined);
    return gameId;
}
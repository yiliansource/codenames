import * as util from "./gameUtility";

import { Player, TeamColour } from "../../shared/codenames";

const players: Player[] = [];

/**
 * Retrieves a player by their ID, returns undefined if no player was found.
 * @param id The ID of the player to find.
 */
export function getPlayer(id: string): Player | undefined {
    return players.find(p => p.id == id);
}

/**
 * Registers a player into the system and returns the instance.
 * @param id The ID to register the player under.
 * @param name The name of the player.
 */
export function registerPlayer(id: string, name: string): Player {
    if (getPlayer(id) != undefined) {
        throw new Error("A player is already registered on socket ID " + id + ".");
    }

    let player: Player = {
        id,
        name,
        team: TeamColour.White
    };
    player.toString = (): string => util.formatPlayer(player);
    
    players.push(player);
    return player;
}
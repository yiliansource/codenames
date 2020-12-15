import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, Player, GamePhase } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";

/**
 * The properties for the team components.
 */
type TeamProps = {
    /**
     * The players inside the team.
     */
    players: Player[];
    /**
     * The colour of the team.
     */
    colour: TeamColour;
    /**
     * The callback when a player wants to switch teams.
     */
    onSwitch: (team: TeamColour) => void;
}

/**
 * Represents the team component.
 */
export const TeamComponent: FunctionComponent<TeamProps> = ({ players, colour, onSwitch }) => {
    const user = useContext(UserContext);
    const game = useContext(GameContext);

    let isRedTeam = colour === TeamColour.Red;

    const teamCards = (game.cards || []).filter(c => c.colour === colour);
    let totalCount = teamCards.length;
    let cardsFound = teamCards.filter(c => c.isConsumed).length;

    return <div className={"relative m-auto transition-opacity " + (game.phase !== GamePhase.Round || game.inTurn === colour ? "opacity-100" : "opacity-50")}>
        <div className={"absolute rounded-lg shadow-md inset-2 transform translate-y-3 " + (isRedTeam ? "bg-red-400" : "bg-blue-400")}></div>
        <div style={{ minWidth: "14rem" }} className="relative rounded-lg shadow-md bg-gray-100 px-8 py-8">
            <h1 className={"text-center font-bold mb-4 " + (isRedTeam ? "text-red-500" : "text-blue-500")}>
                Team {colour.substr(0, 1).toUpperCase() + colour.substr(1)}
            </h1>

            <ul className="block divide-y divide-gray-300">
                {players.map((p, i) => <li key={i} className={"px-4 py-1 " + (p.id === user.id ? "font-bold" : "")}>
                    <span className="mr-1">{p.name}</span>
                    { p.isHost ? <i title="Game Host" className="ml-1 text-yellow-500 fas fa-crown"></i> : '' }
                    { p.isGameMaster ? <i title="Game Master" className={"ml-1 fas fa-hat-wizard " + (isRedTeam ? "text-red-500" : "text-blue-500")}></i> : '' }
                </li>)}
            </ul>

            { teamCards != undefined 
                ? <div className="flex flex-row justify-center mt-4">
                    {Array(totalCount).fill('').map((v, i) => {
                        return <span key={i}
                            className={"mx-0.5 w-2 h-2 rounded-sm transition "
                                + (i < cardsFound ? (isRedTeam ? "bg-red-400" : "bg-blue-400") : "bg-gray-300")}></span>
                    })}
                </div>
                : null
            }

            { game.phase === GamePhase.Lobby && user.team !== colour
                ? <div className="mx-auto">
                    <a className={"block py-1 px-4 mt-4 text-sm text-white text-center rounded-full cursor-pointer transition-colors " 
                        + (isRedTeam ? "bg-red-400 hover:bg-red-500" : "bg-blue-400 hover:bg-blue-500")} onClick={() => onSwitch(colour)}>Switch Team</a>
                </div>
                : null }
        </div>
    </div>
}
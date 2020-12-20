import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, Player, GamePhase } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";
import { formatTeam } from '../formatting';

import i18n, { LangKey } from "../i18n";

/**
 * The properties for the team components.
 */
export interface TeamProps {
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

    let roundsWon = game.winnerHistory.filter(w => w === colour).length;
    let hints = game.hintHistory.filter(h => h.team === colour);

    return <div className={"relative m-auto transition-opacity " + (game.phase !== GamePhase.Round || game.inTurn === colour ? "opacity-100" : "opacity-50")}>
        <div className={"absolute rounded-lg shadow-md inset-2 transform translate-y-3 " + (isRedTeam ? "bg-red-400" : "bg-blue-400")}></div>
        <div style={{ minWidth: "14rem" }} className="relative rounded-lg shadow-md bg-gray-100 px-8 py-8">
            <h1 className="text-center" dangerouslySetInnerHTML={{ __html: formatTeam(colour) }}></h1>
            
            {/* Render a trophy for each victory the team has achieved. */}
            { roundsWon > 0
                ? <div className="text-center">
                    { Array(roundsWon).fill('').map(() => {
                        return <span title="Sweet victory!" className="text-yellow-400 mx-1 text-base"><i className="fas fa-trophy"></i></span>
                    }) }
                </div>
                : null
            }

            {/* Render the players. */}
            <ul className="block divide-y divide-gray-300 mt-4">
                { players.map((p, i) => <li key={i} className={"px-4 py-1 " + (p.id === user.id ? "font-bold" : "") + " " + (p.isReconnecting ? "opacity-40": "")}>
                    <span className="mr-1">{p.name}</span>
                    { p.isHost ? <i title={i18n.format(LangKey.Host)} className="ml-1 text-yellow-500 fas fa-crown"></i> : '' }
                    { p.isGameMaster ? <i title={i18n.format(LangKey.GameMaster)} className={"ml-1 fas fa-hat-wizard " + (isRedTeam ? "text-red-500" : "text-blue-500")}></i> : '' }
                </li>)}
            </ul>

            {/* Render a preview of how many cards have been found. */}
            { teamCards != undefined 
                ? <div className="flex flex-row justify-center mt-4">
                    { Array(totalCount).fill('').map((v, i) => {
                        return <span key={i}
                            className={"mx-0.5 w-2 h-2 rounded-sm transition "
                                + (i < cardsFound ? (isRedTeam ? "bg-red-400" : "bg-blue-400") : "bg-gray-300")}></span>
                    }) }
                </div>
                : null
            }

            {/* Render a list of hints that the team has used. */}
            { game.phase === GamePhase.Round && hints.length > 0
                ? <ul className="block divide-y divide-gray-300 mt-5">
                    { hints.map((h, i) => <li key={i} className="px-4 text-gray-500">
                        <span>{h.word}</span>, <span className="text-gray-400">{h.amount}</span>
                    </li>) }
                </ul>
                : null }

            {/* Show a button to switch teams while in the lobby. */}
            { game.phase === GamePhase.Lobby && user.team !== colour
                ? <div className="mx-auto">
                    <a className={"block px-4 py-1 mt-4 text-sm text-white text-center rounded-full cursor-pointer transition-colors " 
                        + (isRedTeam ? "bg-red-400 hover:bg-red-500" : "bg-blue-400 hover:bg-blue-500")} onClick={() => onSwitch(colour)}
                        >{i18n.format(LangKey.TeamSwitch)}</a>
                </div>
                : null }
        </div>
    </div>
}
import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, Player } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";

import i18n, { LangKey } from '../i18n';

/**
 * The properties for the lobby.
 */
export interface LobbyProps {
    /**
     * The array of players currently in the game/lobby.
     */
    players: Player[];
    /**
     * The callback to invoke when the game is desired to be started.
     */
    onStart: () => void;
}

/**
 * Represents the lobby component.
 */
export const LobbyComponent: FunctionComponent<LobbyProps> = ({ players, onStart }) => {
    const user = useContext(UserContext);
    const game = useContext(GameContext);

    // Teams consist of players filtered by colour.
    let redTeam = players.filter(p => p.team == TeamColour.Red),
        blueTeam = players.filter(p => p.team == TeamColour.Blue);

    return <div className="relative mx-16 my-8">
        <div className="absolute bg-gray-300 inset-3 rounded-lg transform translate-y-5 shadow-md"></div>
        <div className="relative bg-gray-100 rounded-lg py-6 px-10 shadow-md text-center">
            <h1 className="font-bold mb-1 text-lg">{i18n.format(LangKey.LobbyTitle)}</h1>
            <h2 className="mb-4" dangerouslySetInnerHTML={{ __html: i18n.format(LangKey.LobbyGameId, `<span class="font-mono">${game.id}</span>`) }}></h2>
            <p className="mb-1" dangerouslySetInnerHTML={{ __html: i18n.format(LangKey.LobbyDescription1) }}></p>
            <p className="mb-4" dangerouslySetInnerHTML={{ __html: i18n.format(LangKey.LobbyDescription2) }}></p>

            {   // If there are players missing in either team, prompt the necessary changes.
                redTeam.length < 2 || blueTeam.length < 2
                    ? <div className="py-4 border-t border-gray-300">
                        { redTeam.length < 2 ? <p><span className="text-red-500 font-bold">{i18n.format(LangKey.TeamRed)}</span>
                            <span> {i18n.format(LangKey.LobbyMissing, 2 - redTeam.length)}</span></p> : null }
                        { blueTeam.length < 2 ? <p><span className="text-blue-500 font-bold">{i18n.format(LangKey.TeamBlue)}</span>
                            <span> {i18n.format(LangKey.LobbyMissing, 2 - blueTeam.length)}</span></p> : null }
                    </div>
                    // Otherwise display the start button (if the player is the host).
                    : (user.isHost
                        ? <div className="">
                            <a className="inline-block cursor-pointer px-10 py-2 rounded-full bg-green-400 text-white font-bold transition-colors hover:bg-green-500"
                                onClick={() => onStart()}>{i18n.format(LangKey.LobbyStart)}</a>
                        </div> 
                        : null)
            }
        </div>
    </div>
}
import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, Player } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";
import { formatPlayer, formatTeam } from '../formatting';

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
            <h1 className="font-bold mb-1 text-lg">{i18n.formatHtml(LangKey.LobbyTitle)}</h1>
            <h2 className="mb-4">{i18n.formatHtml(LangKey.LobbyGameId, game.id)}</h2>
            <p className="mb-1">{i18n.formatHtml(LangKey.LobbyDescription1)}</p>
            <p className="mb-4">{i18n.formatHtml(LangKey.LobbyDescription2, formatPlayer(players.find(p => p.isHost)))}</p>

            {   // If there are players missing in either team, prompt the necessary changes.
                redTeam.length < 2 || blueTeam.length < 2
                    ? <div className="py-4 border-t border-gray-300">
                        { redTeam.length < 2 ? <p>{i18n.formatHtml(LangKey.LobbyMissing, { team: formatTeam(TeamColour.Red), missing: 2 - redTeam.length })}</p> : null }
                        { blueTeam.length < 2 ? <p>{i18n.formatHtml(LangKey.LobbyMissing, { team: formatTeam(TeamColour.Blue), missing: 2 - blueTeam.length })}</p> : null }
                    </div>
                    // Otherwise display the start button (if the player is the host).
                    : (user.isHost
                        ? <div className="">
                            <a className="inline-block cursor-pointer px-10 py-2 rounded-full bg-green-400 text-white font-bold transition-colors hover:bg-green-500"
                                onClick={() => onStart()}>{i18n.formatHtml(LangKey.LobbyStart)}</a>
                        </div> 
                        : null)
            }
        </div>
    </div>
}
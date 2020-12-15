import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, Player } from "../../../shared/codenames";
import { UserContext } from "../client";

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
    // The user context contains the current user.
    const user = useContext(UserContext);
    // Teams consist of players filtered by colour.
    let redTeam = players.filter(p => p.team == TeamColour.Red),
        blueTeam = players.filter(p => p.team == TeamColour.Blue);

    return <div className="relative mx-16 my-8">
        <div className="absolute bg-gray-300 inset-3 rounded-lg transform translate-y-5 shadow-md"></div>
        <div className="relative bg-gray-100 rounded-lg py-6 px-10 shadow-md text-center">
            <h1 className="font-bold mb-3 text-lg">Lobby</h1>
            <p className="mb-1">Make sure both teams have at least <b>two</b> players.</p>
            <p className="mb-4">Once you are ready, the host needs to press <b>Start</b>!</p>

            {   // If there are players missing in either team, prompt the necessary changes.
                redTeam.length < 2 || blueTeam.length < 2
                    ? <div className="py-4 border-t border-gray-300">
                        { redTeam.length < 2 ? <p><span className="text-red-500 font-bold">Red Team</span> is
                            missing { 2 - redTeam.length } player(s).</p> : null }
                        { blueTeam.length < 2 ? <p><span className="text-blue-500 font-bold">Blue Team</span> is
                            missing { 2 - blueTeam.length } player(s).</p> : null }
                    </div>
                    // Otherwise display the start button (if the player is the host).
                    : (user.isHost
                        ? <div className="">
                            <a className="inline-block cursor-pointer px-10 py-2 rounded-full bg-green-400 text-white font-bold transition-colors hover:bg-green-500"
                                onClick={() => onStart()}>Start!</a>
                        </div> 
                        : null)
            }
        </div>
    </div>
}
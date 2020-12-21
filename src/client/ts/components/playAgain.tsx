import React, { FunctionComponent, useContext } from 'react';
import { GamePhase, TeamColour } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";
import { formatPlayer, formatTeam } from '../formatting';

import i18n, { LangKey } from '../i18n';

/**
 * Represents the lobby component.
 */
export const PlayAgainComponent: FunctionComponent<{ onPlayAgain: () => void }> = ({ onPlayAgain }) => {
    const user = useContext(UserContext);
    const game = useContext(GameContext);

    if (game.phase !== GamePhase.Over) {
        return null;
    }

    let winner = game.winnerHistory[game.winnerHistory.length - 1];

    return <div className="relative mx-auto">
        <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
        <div className="relative bg-gray-100 rounded-lg shadow-md px-8 py-4 text-center">
            <p className="text-lg mb-2">{i18n.formatHtml(LangKey.TeamHasWon, formatTeam(winner))}</p>
            { user.isHost
                ? <a className="inline-block cursor-pointer px-10 py-2 my-2 rounded-full bg-green-400 text-white font-bold transition-colors hover:bg-green-500"
                    onClick={() => onPlayAgain()}>{i18n.format(LangKey.PlayAgainButton)}</a>
                : <p>{i18n.formatHtml(LangKey.PlayAgainRequest, formatPlayer(game.players.find(p => p.isHost)))}</p> }
        </div>
    </div>
}
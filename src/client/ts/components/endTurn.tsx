import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, Player, GamePhase } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";

import i18n, { LangKey } from '../i18n';

export interface EndTurnProps {
    onEndTurn: () => void;
}

/**
 * Represents the component used for ending turns.
 */
export const EndTurnComponent: FunctionComponent<EndTurnProps> = ({ onEndTurn }) => {
    const user = useContext(UserContext);
    const game = useContext(GameContext);

    // Ending turns is only allowed for users that are in turn and not game masters.
    if (game.phase !== GamePhase.Round || !game.hint || user.isGameMaster || user.team !== game.inTurn) {
        return null;
    }

    return <div className="relative mx-6">
        <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
        <div className="relative bg-gray-100 rounded-lg shadow-md px-8 py-4">
            <a className="inline-block cursor-pointer px-10 py-2 rounded-full bg-green-400 text-white font-bold transition-colors hover:bg-green-500"
                onClick={() => onEndTurn()}>{i18n.formatHtml(LangKey.EndTurn)}</a>
        </div>
    </div>
}
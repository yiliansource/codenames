import React, { FunctionComponent, useContext } from 'react';
import { GamePhase } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";

import i18n, { LangKey } from '../i18n';

export interface PlayAgainProps {
    onPlayAgain: () => void;
}

/**
 * Represents the lobby component.
 */
export const PlayAgainComponent: FunctionComponent<PlayAgainProps> = ({ onPlayAgain }) => {
    const user = useContext(UserContext);
    const game = useContext(GameContext);

    // TODO: Prompt non-hosts to ask the hosts to play again.

    if (game.phase !== GamePhase.Over || !user.isHost) {
        return null;
    }

    return <div className="relative mx-auto">
        <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
        <div className="relative bg-gray-100 rounded-lg shadow-md px-8 py-4">
            <a className="inline-block cursor-pointer px-10 py-2 rounded-full bg-green-400 text-white font-bold transition-colors hover:bg-green-500"
                onClick={() => onPlayAgain()}>{i18n.format(LangKey.PlayAgain)}</a>
        </div>
    </div>
}
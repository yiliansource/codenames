import React, { FunctionComponent, useContext } from 'react';
import { TeamColour, GamePhase } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";

/**
 * Helper function to generate a square colour from a team colour.
 */
export function getSolutionColour(colour: TeamColour): string {
    switch(colour) {
        case TeamColour.White: return "bg-gray-300";
        case TeamColour.Black: return "bg-gray-700";
        case TeamColour.Red: return "bg-red-400";
        case TeamColour.Blue: return "bg-blue-400";
        default: return "";
    }
}

/**
 * Represents a solution visual. Only visible to game masters.
 */
export const SolutionComponent: FunctionComponent = () => {
    const user = useContext(UserContext);
    const game = useContext(GameContext);

    if (game.phase !== GamePhase.Round || game.cards === undefined || !user.isGameMaster) {
        return null;
    }

    return <div className="relative mx-6">
        <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
        <div className="relative bg-gray-100 rounded-lg shadow-md p-4">
            <div className="grid grid-cols-5 gap-2">
                { game.cards.map(card => {
                    return <div key={card.content} className={"w-5 h-5 rounded-sm " + getSolutionColour(card.colour)}></div>
                }) }
            </div>
        </div>
    </div>
}
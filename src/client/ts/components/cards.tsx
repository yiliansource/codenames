import React, { FunctionComponent, MouseEvent, useContext } from 'react';
import { Card, TeamColour } from "../../../shared/codenames";
import { UserContext, GameContext } from "../client";

/**
 * The properties for the card grid component.
 */
export interface CardGridProps {
    /**
     * The collection of cards to display in the grid.
     */
    cards: Card[];
    /**
     * The callback to apply once a card (identified via index) is clicked.
     */
    onClick: (index: number) => void;
}

/**
 * The properties for a single card component.
 */
export interface CardProps {
    /**
     * The actual card instance that should be visualized.
     */
    card: Card;
    /**
     * The callback to apply once the card is clicked (without any sort of validation).
     */
    onClick: (event: MouseEvent) => void;
}

/**
 * Represents the card grid component.
 */
export const CardGrid: FunctionComponent<CardGridProps> = ({ cards, onClick }) => <div
    className={"grid grid-cols-5 grid-rows-5 gap-4 rounded-2xl ring-1 ring-white ring-opacity-25 p-8 py-6 mx-6 my-8 2xl:mx-16 shadow transition-opacity "
        + (useContext(GameContext).hint === undefined ? "opacity-50" : "opacity-100")}>
    {(cards || []).map((card, index) => <CardComponent key={index.toString()} card={card} onClick={() => onClick(index)} />)}
</div>

/**
 * Represents a card component.
 */
export const CardComponent: FunctionComponent<CardProps> = ({ card, onClick }) => {
    const game = useContext(GameContext);
    const user = useContext(UserContext);

    // Specify the default colour scheme (unconsumed - the colour is hidden).
    let backgroundColour = "bg-gray-100";
    let underlayColour = "bg-gray-400";
    // If a card is already consumed, its colour scheme is determined by its (team) colour.
    if (card.isConsumed) {
        switch (card.colour) {
            case TeamColour.White: backgroundColour = "bg-gray-400"; underlayColour = "bg-gray-500"; break;
            case TeamColour.Black: backgroundColour = "bg-gray-700"; underlayColour = "bg-gray-800"; break;
            case TeamColour.Red: backgroundColour = "bg-red-300"; underlayColour = "bg-red-400"; break;
            case TeamColour.Blue: backgroundColour = "bg-blue-300"; underlayColour = "bg-blue-400"; break;
        }
    }

    // Consumed cards do not normally display their content, only when hovered.
    return <div className="relative">
        <div className={"absolute rounded-lg shadow-md inset-2 transform translate-y-3 transition-colors " + underlayColour}></div>
        <div className={"relative rounded-lg shadow-md transition-colors " + backgroundColour + (!card.isConsumed ? " hover:bg-gray-200" : "")} onClick={onClick}>
            <div className={"px-4 2xl:px-8 py-8 text-center " + (card.isConsumed ? "transition-opacity opacity-0 hover:opacity-60" : "cursor-pointer") + " "
                + (game.inTurn !== user.team || user.isGameMaster ? "cursor-not-allowed" : '')}>
                <p className="text-base 2xl:text-lg font-semibold text-gray-800 ">{card.content}</p>
            </div>
        </div>
    </div>
}
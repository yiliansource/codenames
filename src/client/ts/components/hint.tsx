import React, { FunctionComponent, useContext } from 'react';
import { GamePhase, Hint } from "../../../shared/codenames";
import { GameContext, UserContext } from "../client";

export interface HintProps {
    hint: Hint;
    onSubmit: (hint: Hint) => void;
}

export const HintComponent: FunctionComponent<HintProps> = ({ hint, onSubmit }) => {
    let userContext = useContext(UserContext);
    let gameContext = useContext(GameContext);

    // Don't show the component during other phases than the round
    // if (gameContext.phase !== GamePhase.Round) {
    //     return null;
    // }
    if (true) {
    //if (userContext.isGameMaster && userContext.team === gameContext.inTurn && gameContext.hint == undefined) {
        return <div className="relative mx-auto">
            <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
            <div className="relative bg-gray-100 rounded-lg shadow-md flex flex-col place-items-center px-12 py-8">
                <p className="text-xs my-2 text-gray-600 uppercase">Hint Word</p>
                <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300" type="text" placeholder="Hint Word"/>
                <p className="text-xs my-2 text-gray-600 uppercase">Amount</p>
                <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300" type="number" placeholder="1" min="1" max="10"/>
                <a className="block mt-4 bg-green-400 rounded-full text-white text-center font-bold py-1.5 px-8 transition cursor-pointer focus:bg-green-500 hover:bg-green-500 focus:outline-none"
                    >Submit Hint</a>
            </div>
        </div>
    }
    else {
        if (hint !== undefined) {
            return <div className="flex flex-col place-items-center">
                <p>{hint.word}</p>
                <p>{hint.amount}</p>
            </div>
        }
    }
    return null;
}


{/* <div className="relative flex my-8">
    <div className="absolute w-4 h-4 bg-gray-100 inset-0 left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    <div className="relative mx-auto py-4 px-8 rounded-lg bg-gray-100 text-gray-800">{hint}</div>
</div> */}
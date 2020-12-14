import React, { FunctionComponent, MouseEvent } from 'react';
import ReactDOM from 'react-dom';

import { GameState, Card, TeamColour, GamePhase, ClientAction } from "../../shared/codenames";
import { HintProps, TeamProps, CardGridProps, CardProps } from "./components";

const container = document.getElementById("app");

import * as Registration from "./registration";
Registration.show(container, (name: string) => {
    const socket = io("ws://localhost:3000", {
        transports: [ 'websocket' ]
    });
    socket.emit('register', name, (state: GameState) => {
        ReactDOM.render(<Game state={state} socket={socket}/>, container);
    });
});

type GameProps = {
    state: GameState;
    socket: SocketIOClient.Socket;
}
export default class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = props.state;
        props.socket.on('game_state_updated', this.setState.bind(this));
    }

    performAction(name: string, data: any) {
        let args: ClientAction = {
            action: name,
            data: data
        };
        this.props.socket.emit('action', args);
    }

    nominateCard(index: number) {
        if (!this.state.cards[index].isConsumed) {
            this.performAction('nominateCard', index);
        }
    }

    render() {
        return <div>
            <HintComponent {...this.state.hint} />
            <div className="flex flex-row">
                <TeamComponent colour={TeamColour.Red} players={this.state.players.filter(p => p.team == TeamColour.Red)} cards={this.state.cards} />

                { 
                    this.state.phase == GamePhase.Round
                        ? <CardGrid cards={this.state.cards} onClick={this.nominateCard.bind(this)} />
                        : <LobbyComponent {...this.state}/> 
                }
                
                <TeamComponent colour={TeamColour.Blue} players={this.state.players.filter(p => p.team == TeamColour.Blue)} cards={this.state.cards} />
            </div>
        </div>
    }
}

export const LobbyComponent: FunctionComponent<GameState> = ({ players }) => {
    let redTeam = players.filter(p => p.team == TeamColour.Red),
        blueTeam = players.filter(p => p.team == TeamColour.Blue);

    return <div className="relative mx-16 my-8">
        <div className="absolute bg-gray-300 inset-3 rounded-lg transform translate-y-5 shadow-md"></div>
        <div className="relative bg-gray-100 rounded-lg py-6 px-10 shadow-md text-center">
            <h1 className="font-bold mb-3 text-lg">Lobby</h1>
            <p className="mb-1">Make sure both teams have at least <b>two</b> players.</p>
            <p className="mb-4">Once you are ready, the host needs to press <b>Start</b>!</p>

            {
                redTeam.length < 2 || blueTeam.length < 2
                    ? <div className="py-4 border-t border-gray-300">
                        { redTeam.length < 2 ? <p><span className="text-red-500 font-bold">Red Team</span> is
                            missing { 2 - redTeam.length } player(s).</p> : '' }
                        { blueTeam.length < 2 ? <p><span className="text-blue-500 font-bold">Blue Team</span> is
                            missing { 2 - blueTeam.length } player(s).</p> : '' }
                    </div>
                    : <div><p>Start!</p></div>
            }
        </div>
    </div>
}

export const HintComponent: FunctionComponent<HintProps> = ({ message: hint }) => <div className="relative flex my-8">
    <div className="absolute w-4 h-4 bg-gray-100 inset-0 left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    <div className="relative mx-auto py-4 px-8 rounded-lg bg-gray-100 text-gray-800">{hint}</div>
</div>


export const TeamComponent: FunctionComponent<TeamProps> = ({ players, colour, cards }) => {
    let isRedTeam = colour === TeamColour.Red;

    let allTeamCards = (cards || []).filter(c => c.colour === colour);
    let totalCount = allTeamCards.length;
    let cardsFound = allTeamCards.filter(c => c.isConsumed).length;

    return <div className="relative m-auto">
        <div className={"absolute rounded-lg shadow-md inset-2 transform translate-y-3 " + (isRedTeam ? "bg-red-400" : "bg-blue-400")}></div>
        <div className="relative rounded-lg shadow-md bg-gray-100 px-8 py-8">
            <h1 className={"text-center font-bold mb-4 " + (isRedTeam ? "text-red-500" : "text-blue-500")}>
                Team {colour.substr(0, 1).toUpperCase() + colour.substr(1)}
            </h1>
            <ul className="block divide-y divide-gray-300">
                {players.map((p, i) => <li key={i} className="px-4 py-1">{p.name}</li>)}
            </ul>
            { cards != undefined 
                ? <div className="flex flex-row justify-center mt-4">
                    {Array(totalCount).fill('').map((v, i) => {
                        return <span key={i}
                            className={"mx-0.5 w-2 h-2 rounded-sm transition "
                                + (i < cardsFound ? (isRedTeam ? "bg-red-400" : "bg-blue-400") : "bg-gray-300")}></span>
                    })}
                </div>
                : ""
            }
        </div>
    </div>
}


export const CardGrid: FunctionComponent<CardGridProps> = ({ cards, onClick }) => <div
    className="grid grid-cols-5 grid-rows-5 gap-4 rounded-2xl ring-1 ring-white ring-opacity-25 p-8 py-6 mx-16 shadow">
    {cards.map((card, index) => <CardComponent key={index.toString()} card={card} onClick={() => onClick(index)} />)}
</div>

export const CardComponent: FunctionComponent<CardProps> = ({ card, onClick }) => {
    let foregroundColour = "bg-gray-100";
    let backgroundColour = "bg-gray-400";

    if (card.isConsumed) {
        switch (card.colour) {
            case TeamColour.White: foregroundColour = "bg-gray-400"; backgroundColour = "bg-gray-500"; break;
            case TeamColour.Black: foregroundColour = "bg-gray-600"; backgroundColour = "bg-gray-700"; break;
            case TeamColour.Red: foregroundColour = "bg-red-300"; backgroundColour = "bg-red-400"; break;
            case TeamColour.Blue: foregroundColour = "bg-blue-300"; backgroundColour = "bg-blue-400"; break;
        }
    }

    return <div className="relative">
        <div className={"absolute rounded-lg shadow-md inset-2 transform translate-y-3 transition " + backgroundColour}></div>
        <div className={"relative rounded-lg shadow-md transition " + foregroundColour} onClick={onClick}>
            <div className={"px-16 py-8 " + (card.isConsumed ? "transition opacity-0 hover:opacity-60" : "cursor-pointer")}>
                <p className="text-lg font-semibold text-gray-800 ">{card.content}</p>
            </div>
        </div>
    </div>
}
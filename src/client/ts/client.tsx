import React from 'react';
import ReactDOM from 'react-dom';

import { GameState, TeamColour, GamePhase, ClientAction, Player, Hint } from "../../shared/codenames";
import { CardGrid, CardComponent } from "./components/cards";
import { HintComponent } from "./components/hint";
import { LobbyComponent } from "./components/lobby";
import { TeamComponent } from "./components/teams";
import * as registration from "./components/registration";

import i18n, { LanguageDefinition } from "./i18n";

const container = document.getElementById("app");

export const UserContext = React.createContext(undefined) as React.Context<Player>;
export const GameContext = React.createContext(undefined) as React.Context<GameState>;

registration.show(container, (name: string) => {
    const socket = io("ws://localhost:3000", { transports: [ 'websocket' ] });
    socket.emit('register', name, (state: GameState) => {
        ReactDOM.render(<Game state={state} socket={socket}/>, container);
    });
});

type GameProps = {
    state: GameState;
    socket: SocketIOClient.Socket;
}
export default class Game extends React.Component<GameProps, GameState> {
    get currentPlayer() {
        return this.state.players.find(p => p.id === this.props.socket.id);
    }

    constructor(props: GameProps) {
        super(props);

        this.state = props.state;
        props.socket.on('game_state_updated', this.setState.bind(this));
    }

    performAction(name: string, data: any = undefined) {
        let args: ClientAction = {
            action: name,
            data: data
        };
        this.props.socket.emit('action', args);
    }

    switchTeam(team: TeamColour) {
        this.performAction('switchTeam', team);
    }
    startGame() {
        this.performAction('startGame');
    }
    submitHint(hint: Hint) {
        this.performAction('submitHint', hint);
    }
    nominateCard(index: number) {
        if (!this.state.cards[index].isConsumed) {
            this.performAction('nominateCard', index);
        }
    }

    render() {
        return <div className="flex flex-col">
            <GameContext.Provider value={this.state}>
                <UserContext.Provider value={this.currentPlayer}>
                    <HintComponent hint={this.state.hint} onSubmit={this.submitHint.bind(this)} />
                    <div className="flex flex-row items-center">
                        <TeamComponent colour={TeamColour.Red} players={this.state.players.filter(p => p.team == TeamColour.Red)} onSwitch={this.switchTeam.bind(this)}/>

                        { this.state.phase == GamePhase.Round
                                ? <CardGrid cards={this.state.cards} onClick={this.nominateCard.bind(this)} />
                                : <LobbyComponent players={this.state.players} onStart={this.startGame.bind(this)}/> }
                
                        <TeamComponent colour={TeamColour.Blue} players={this.state.players.filter(p => p.team == TeamColour.Blue)} onSwitch={this.switchTeam.bind(this)}/>
                    </div>
                </UserContext.Provider>
            </GameContext.Provider>
        </div>
    }
}
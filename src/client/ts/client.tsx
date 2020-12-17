import React from 'react';
import ReactDOM from 'react-dom';

import { GameState, TeamColour, GamePhase, ClientAction, Player, Hint, JoinGameOptions } from "../../shared/codenames";
import { CardGrid } from "./components/cards";
import { HintComponent } from "./components/hint";
import { SolutionComponent } from "./components/solution";
import { EndTurnComponent } from "./components/endTurn";
import { LobbyComponent } from "./components/lobby";
import { TeamComponent } from "./components/teams";
import { PlayAgainComponent } from "./components/playAgain";
import * as registration from "./components/registration";

import i18n from "./i18n";

const container = document.getElementById("app");

export const UserContext = React.createContext(undefined) as React.Context<Player>;
export const GameContext = React.createContext(undefined) as React.Context<GameState>;

const performGameEntryAction = (event: string, options: JoinGameOptions) => {
    const socket = io("/", { transports: [ 'websocket' ] });
    const promise = new Promise<GameState>((resolve, reject) => {
        // Attempt to create or join a game.
        socket.emit(event, options, (result: GameState | string) => {
            // If the result is a string, the server returned an error.
            if (typeof result === "string") { reject(result); }
            // Otherwise the result contains the current game state.
            else {
                const game = result as GameState;
                // Initialize the language lookup according to the defined language of the game.
                i18n.loadLanguage(game.language);
                // Render the game component, using the received state.
                ReactDOM.render(<Game state={game} socket={socket} />, container);
                // Push the game ID into the URL, to allow quick joins via URL.
                window.history.pushState({}, '', window.location.href.split('?')[0] + "?id=" + game.id);

                // Tell the form that a valid game state was received.
                resolve(game);
            }
        });
    });
    return promise;
}

// Show the registration, using the designated callbacks.
registration.show(container, {
    onCreateGame: (options): Promise<GameState> => performGameEntryAction('createGame', options),
    onJoinGame: (options): Promise<GameState> => performGameEntryAction('joinGame', options)
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
    endTurn() {
        this.performAction('endTurn');
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
                    <div className="flex flex-row items-center mx-auto">
                        <HintComponent hint={this.state.hint} game={this.state} user={this.currentPlayer} onSubmit={this.submitHint.bind(this)} />
                        <SolutionComponent />
                        <EndTurnComponent onEndTurn={this.endTurn.bind(this)} />
                    </div>
                    <div className="flex flex-row items-center">
                        <TeamComponent colour={TeamColour.Red} players={this.state.players.filter(p => p.team == TeamColour.Red)} onSwitch={this.switchTeam.bind(this)}/>

                        { this.state.phase == GamePhase.Lobby
                            ? <LobbyComponent players={this.state.players} onStart={this.startGame.bind(this)}/> 
                            : <CardGrid cards={this.state.cards} onClick={this.nominateCard.bind(this)} /> }
                
                        <TeamComponent colour={TeamColour.Blue} players={this.state.players.filter(p => p.team == TeamColour.Blue)} onSwitch={this.switchTeam.bind(this)}/>
                    </div>
                    <PlayAgainComponent onPlayAgain={this.startGame.bind(this)} />
                </UserContext.Provider>
            </GameContext.Provider>
        </div>
    }
}
import React from 'react';
import ReactDOM from 'react-dom';
import { CreateGameOptions, GameState, JoinGameOptions, Language } from '../../../shared/codenames';

/**
 * The properties of the registration form.
 */
export interface RegisterFormProps {
    onCreateGame: (options: CreateGameOptions) => Promise<GameState>;
    onJoinGame: (options: JoinGameOptions) => Promise<GameState>;
}

/**
 * The current state of the registration form.
 */
export interface RegisterFormState {
    /**
     * The options used for creating a new game.
     */
    createGame: CreateGameOptions;
    /**
     * The options used for joining an existing game.
     */
    joinGame: JoinGameOptions;
    /**
     * Is a form currently submitting? If so, which one?
     */
    submitting?: SubmittingForm;
    /**
     * The optional error message on the Create Game form.
     */
    createError?: string;
    /**
     * The optional error message on the Join Game form.
     */
    joinError?: string;
}

/**
 * A constant register for the form elements.
 */
const enum RegistrationInputField {
    CreateFormNameInput = "createForm:nameInput",
    CreateFormLanguageSelect = "createForm:languageSelect",
    CreateFormGameIdInput = "createForm:gameIdInput",
    JoinFormNameInput = "joinForm:nameInput",
    JoinFormGameIdInput = "joinForm:gameIdInput"
}

/**
 * Represents the forms available during registration.
 */
const enum SubmittingForm {
    Create = "create",
    Join = "join"
}

/**
 * Used to validate username inputs (before submitting).
 */
const nameValidation: RegExp = /^[a-z ]{3,}$/i;

/**
 * Represents the registration form for the game.
 */
export class RegisterForm extends React.Component<RegisterFormProps, RegisterFormState> {
    constructor(props: RegisterFormProps) {
        super(props);

        this.state = {
            createGame: {
                name: '',
                gameId: '',
                language: Language.English
            },
            joinGame: {
                name: '',
                gameId: new URLSearchParams(window.location.search).get('id') || ''
            }
        };
    }

    /**
     * Updates the state of the form options according to user input.
     */
    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const inputType = target.name as RegistrationInputField;

        if (inputType === RegistrationInputField.CreateFormNameInput) {
            this.setState({ createGame: { ...this.state.createGame, name: value } });
        }
        else if (inputType === RegistrationInputField.CreateFormLanguageSelect) {
            this.setState({ createGame: { ...this.state.createGame, language: value as Language } });
        }
        else if (inputType === RegistrationInputField.CreateFormGameIdInput) {
            this.setState({ createGame: { ...this.state.createGame, gameId: value } });
        }
        else if (inputType === RegistrationInputField.JoinFormNameInput) {
            this.setState({ joinGame: { ...this.state.joinGame, name: value } });
        }
        else if (inputType === RegistrationInputField.JoinFormGameIdInput) {
            this.setState({ joinGame: { ...this.state.joinGame, gameId: value }});
        }
    }

    /**
     * Allows quick submission of the form on specific elements if the enter key is pressed.
     */
    handleEnterPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            const inputType = event.currentTarget.name as RegistrationInputField;

            if (inputType === RegistrationInputField.CreateFormNameInput || inputType === RegistrationInputField.CreateFormGameIdInput) {
                this.createGame();
            }
            if (inputType === RegistrationInputField.JoinFormNameInput || inputType === RegistrationInputField.JoinFormGameIdInput) {
                this.joinGame();
            }
        }
    }

    /**
     * Attempts to create a game.
     * If the callback promise throws an error, a validation error is displayed.
     */
    createGame() {
        if (this.state.submitting == undefined) {
            if (!nameValidation.test(this.state.createGame.name)) {
                this.setState({ createError: "The name is too short or contains invalid characters." });
            }
            else {
                this.setState({ submitting: SubmittingForm.Create });
                this.props.onCreateGame(this.state.createGame)
                    .catch((err) => {
                        this.setState({
                            submitting: undefined,
                            createError: err
                        });
                    });
            }
        }
    }

    /**
     * Attempts to join a game.
     * If the callback promise throws an error, a validation error is displayed.
     */
    joinGame() {
        if (this.state.submitting == undefined) {
            if (!nameValidation.test(this.state.joinGame.name)) {
                this.setState({ joinError: "The name is too short or contains invalid characters." });
            }
            else {
                this.setState({ submitting: SubmittingForm.Join });
                this.props.onJoinGame(this.state.joinGame)
                    .catch((err) => {
                        this.setState({
                            submitting: undefined,
                            joinError: err
                        });
                    });
                }
        }
    }

    render() {
        return <div id="panel" className="relative m-auto">
            <div className="absolute rounded-xl shadow-lg inset-3 bg-gray-300 transform translate-y-5"></div>
            <div className="relative flex flex-col justify-items-center rounded-xl shadow-lg bg-gray-100 px-6 py-10">
                <h1 className="text-3xl text-center font-bold mb-4">Play Codenames!</h1>
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-gray-100 p-1 text-gray-300">or</p>
                <div className="grid grid-cols-2 divide-x max-w-3xl py-4 place-items-center">
                    <div className={"flex flex-col px-16 " + (this.state.submitting === SubmittingForm.Join ? "transition-opacity opacity-30" : "")}>
                        <h2 className="text-xl text-center font-bold mb-3">Create a game</h2>

                        <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300 transition focus:ring-gray-400"
                            value={this.state.createGame.name} name={RegistrationInputField.CreateFormNameInput} placeholder="Username" autoFocus 
                            onChange={this.handleInputChange.bind(this)} onKeyUp={this.handleEnterPress.bind(this)} autoComplete="off"/>
                        <select className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300 transition focus:ring-gray-400"
                            value={this.state.createGame.language} name={RegistrationInputField.CreateFormLanguageSelect} onChange={this.handleInputChange.bind(this)}>
                            <option value={Language.English}>English</option>
                            <option value={Language.German}>Deutsch</option>
                        </select>
                        <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-3 focus:outline-none ring-1 ring-gray-300 transition focus:ring-gray-400"
                            value={this.state.createGame.gameId} name={RegistrationInputField.CreateFormGameIdInput} placeholder="Game ID"
                            onChange={this.handleInputChange.bind(this)} onKeyUp={this.handleEnterPress.bind(this)} autoComplete="off"/>

                        { this.state.createError
                            ? <p className="text-red-500 text-sm text-center mb-3">{this.state.createError}</p>
                            : null }

                        <button className={"rounded-full text-white text-center font-bold py-1.5 transition cursor-pointer focus:outline-none " 
                            + (this.state.submitting == undefined ? " bg-green-400 focus:bg-green-500 hover:bg-green-500" : "bg-gray-300 cursor-wait")}
                            onClick={this.createGame.bind(this)}>Create Game</button>
                    </div>
                    <div className={"flex flex-col px-16 " + (this.state.submitting === SubmittingForm.Create ? "transition-opacity opacity-30" : "")}>
                        <h2 className="text-xl text-center font-bold mb-3">Join a game</h2>

                        <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300 transition focus:ring-gray-400"
                            value={this.state.joinGame.name} name={RegistrationInputField.JoinFormNameInput} placeholder="Username" 
                            onChange={this.handleInputChange.bind(this)} onKeyUp={this.handleEnterPress.bind(this)} autoComplete="off"/>
                        <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-3 focus:outline-none ring-1 ring-gray-300 transition focus:ring-gray-400"
                            value={this.state.joinGame.gameId} name={RegistrationInputField.JoinFormGameIdInput} placeholder="Game ID"
                            onChange={this.handleInputChange.bind(this)} onKeyUp={this.handleEnterPress.bind(this)} autoComplete="off"/>

                        { this.state.joinError
                            ? <p className="text-red-500 text-sm text-center mb-3">{this.state.joinError}</p>
                            : null }

                        <button className={"rounded-full text-white text-center font-bold py-1.5 transition cursor-pointer focus:outline-none " 
                            + (this.state.submitting == undefined ? " bg-green-400 focus:bg-green-500 hover:bg-green-500" : "bg-gray-300 cursor-wait")}
                            onClick={this.joinGame.bind(this)}>Join Game</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

/**
 * Shows the registration form inside the specified container, with specified callbacks on submission.
 */
export function show(container: Element, callbacks: RegisterFormProps) {
    const urlParams = new URLSearchParams(window.location.search);
    ReactDOM.render(<RegisterForm {...callbacks} />, container);
}
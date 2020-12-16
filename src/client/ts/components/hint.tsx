import React from 'react';
import { GamePhase, GameState, Hint, Player } from "../../../shared/codenames";

import i18n, { LangKey } from "../i18n";

/**
 * Represents the properties on the interface component.
 */
export interface HintProps {
    hint?: Hint;
    user: Player;
    game: GameState;
    onSubmit: (hint: Hint) => void;
}
/**
 * Represents the current state of the hint component.
 */
export interface HintState {
    wordInput: string;
    amountInput: number;
    validationMessage?: string;
}

/**
 * Represents the hint component itself, providing visuals for non-game-masters and input functionality for game masters.
 */
export class HintComponent extends React.Component<HintProps, HintState> {
    constructor(props: HintProps) {
        super(props);

        // Default the state to an empty string and the number one.
        this.state = {
            wordInput: '',
            amountInput: 1
        }
    }

    /**
     * Invoked when the user modifies the text input. Validates the format of the hint word (only alphabetical characters).
     */
    onWordChange(word: string) {
        if (/^[a-zäöü ]*$/i.test(word)) {
            this.setState({ wordInput: word });
        }
    }
    /**
     * Invoked when the user modifies the amount input. Validates the range of the amount (from 1 to 10).
     */
    onAmountChange(amount: string) {
        if (/[0-9]+/.test(amount)) {
            let num = parseInt(amount);
            if (num >= 1 && num <= 10) {
                this.setState({ amountInput: num });
            }
        }
    }

    /**
     * Performs further validation on the input values.
     * The most intricate check is whether the word occurs in any of the cards.
     * Returns true if all validation succeeds.
     */
    validate(): boolean {
        let word = this.state.wordInput;
        if (this.props.game.cards != undefined && (new RegExp(this.props.game.cards.map(c => c.content).join('|'), 'i').test(word) 
            || this.props.game.cards.some(c => new RegExp(word, 'i').test(c.content)))) {
            this.setState({ validationMessage: i18n.format(LangKey.HintIncludesCardWord) });
            return false;
        }
        else {
            this.setState({ validationMessage: undefined });
            return true;
        }
    }

    /**
     * Attempts to submit the input form, if validation is successful.
     */
    submit() {
        if (this.validate()) {
            this.props.onSubmit({
                word: this.state.wordInput,
                amount: this.state.amountInput,
                team: this.props.user.team
            });
            this.setState({
                wordInput: '',
                amountInput: 1
            });
        }
    }

    render() {
        // Don't show the component during other phases than the round
        if (this.props.game.phase !== GamePhase.Round) {
            return null;
        }
        // Prompt the user for a hint input if they are a game master, are in turn, and no hint exists yet.
        if (this.props.user.isGameMaster && this.props.user.team === this.props.game.inTurn && !this.props.game.hint) {
            return <div className="relative mx-4">
                <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
                <div className="relative bg-gray-100 rounded-lg shadow-md flex flex-col place-items-center px-10 py-4">
                    <p className="text-xs my-2 text-gray-600 uppercase">{i18n.format(LangKey.HintWord)}</p>
                    <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300"
                        type="text" value={this.state.wordInput} placeholder={i18n.format(LangKey.HintWord)} onChange={e => this.onWordChange(e.target.value)}/>
                    <p className="text-xs my-2 text-gray-600 uppercase">{i18n.format(LangKey.HintAmount)}</p>
                    <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full mb-2 focus:outline-none ring-1 ring-gray-300"
                        type="number" value={this.state.amountInput} placeholder="1" min="1" max="10" onChange={e => this.onAmountChange(e.target.value)}/>
                    { this.state.validationMessage != undefined ? <p className="text-red-500">{this.state.validationMessage}</p> : null }
                    <button className="block mt-4 bg-green-400 rounded-full text-white text-center font-bold py-1.5 px-8 transition cursor-pointer focus:bg-green-500 hover:bg-green-500 focus:outline-none"
                        onClick={this.submit.bind(this)}>{i18n.format(LangKey.HintSubmit)}</button>
                </div>
            </div>
        }
        else {
            return <div className="relative mx-6">
                <div className="absolute bg-gray-300 rounded-lg shadow-md inset-3 transform translate-y-5"></div>
                <div className="relative bg-gray-100 rounded-lg shadow-md flex flex-col place-items-center px-20 py-10">
                    { this.props.hint
                        ? <p className="text-4xl text-gray-800 font-light">
                            <span className="font-bold">{this.props.hint.word}</span>,&nbsp;
                            <span className="text-gray-600">{this.props.hint.amount}</span>
                        </p>
                        : <p>{i18n.format(LangKey.HintPleaseWait)}</p> }
                </div>
            </div>
        }
    }
}
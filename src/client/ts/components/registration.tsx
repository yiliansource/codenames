import React from 'react';
import ReactDOM from 'react-dom';
import { Language } from '../../../shared/codenames';

import i18n, { LangKey } from "../i18n";

/**
 * The properties of the registration form.
 */
export interface RegisterFormProps {
    /**
     * The default name that should be filled into the form.
     */
    defaultName?: string;
    /**
     * The default language that should be filled into the form.
     */
    defaultLanguage?: Language;
    /**
     * The callback that should be applied on form submission.
     */
    onSubmit: (name: string, lang: Language) => void;
}

/**
 * The current state of the registration form.
 */
export interface RegisterFormState {
    /**
     * The current name input in the form.
     */
    name: string;
    /**
     * The current language selection in the form.
     */
    language: Language;
    /**
     * The current validation message of the form.
     */
    validationMessage?: string;
    /**
     * Whether the form is currently being submitted or not.
     */
    isSubmitting?: boolean;
}

/**
 * Represents the registration form for the game.
 */
export class RegisterForm extends React.Component<RegisterFormProps, RegisterFormState> {
    constructor(props: RegisterFormProps) {
        super(props);

        this.state = { 
            name: props.defaultName || '',
            language: props.defaultLanguage || Language.English
        };
    }

    /**
     * Updates the current name property from the changed input.
     */
    onNameChange(name: string) {
        if (!this.state.isSubmitting) {
            this.setState({ name: name });
        }
    }

    onLanguageChange(lang: Language) {
        if (!this.state.isSubmitting) {
            this.setState({ language: lang });
        }
    }

    /**
     * Handles an enter press in the input fields, to allow easier form submission.
     */
    handleEnter(e: React.KeyboardEvent) {
        if (e.key == "Enter" && !this.state.isSubmitting) {
            this.submit();
        }
    }

    /**
     * Attempts to submit the form.
     */
    submit() {
        if (this.state.name.length < 3) {
            this.setState({ validationMessage: i18n.format(LangKey.RegistrationUsernameTooShort) });
        }
        else {
            this.setState({ isSubmitting: true });
            this.props.onSubmit(this.state.name, this.state.language);
        }
    }

    render() {
        // Conditionally display a validation (error) message.
        let validationMessage = this.state.validationMessage != null
            ? <p className="max-w-xs px-6 mb-2 text-center text-red-500">{this.state.validationMessage}</p> : "";

        // Allow the user to input a name.
        let nameInput = <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full my-1 focus:outline-none ring-1 ring-gray-300"
            value={this.state.name} placeholder="Username" autoFocus onChange={e => this.onNameChange(e.target.value)} onKeyUp={this.handleEnter.bind(this)}/>

        let languageSelect = <select className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full my-1 focus:outline-none ring-1 ring-gray-300"
            value={this.state.language} onChange={e => this.onLanguageChange(e.target.value as Language)}>
            <option value={Language.English}>English</option>
            <option value={Language.German}>Deutsch</option>
        </select>

        // Show an en- or disabled submission button, depending on whether the form is already being submitted or not.
        let playButton = this.state.isSubmitting
            ? <a className="mt-2 bg-gray-300 rounded-full text-white text-center font-bold py-1.5 transition cursor-wait focus:outline-none" tabIndex={-1}
            >{i18n.format(LangKey.RegistrationSubmit)}</a>
            : <button className="mt-2 bg-green-400 rounded-full text-white text-center font-bold py-1.5 transition cursor-pointer focus:bg-green-500 hover:bg-green-500 focus:outline-none"
                id="join" onClick={() => this.submit()}>Play!</button>

        return <div id="panel" className="relative m-auto">
            <div className="absolute rounded-xl shadow-lg inset-3 bg-gray-300 transform translate-y-5"></div>
            <div className="relative flex flex-col justify-items-center rounded-xl shadow-lg bg-gray-100 px-32 py-10">
                <h1 className="text-3xl text-center font-bold mb-4">{i18n.format(LangKey.RegistrationTitle)}</h1>
                <p className="text-center mb-2">{i18n.format(LangKey.RegistrationMessage)}</p>
                {validationMessage}
                {nameInput}
                {languageSelect}
                {playButton}
            </div>
        </div>
    }
}

/**
 * Shows the registration form inside the specified container, with a specified callback on submission.
 */
export function show(container: Element, onSubmit: (name: string, lang: Language) => void) {
    const urlParams = new URLSearchParams(window.location.search);
    ReactDOM.render(<RegisterForm defaultName={urlParams.get('name')} onSubmit={onSubmit}/>, container);
}
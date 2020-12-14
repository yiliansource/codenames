import React from 'react';
import ReactDOM from 'react-dom';

import i18n from "./i18n";

type RegisterFormProps = {
    defaultName?: string;
    //defaultRoomId?: string;
    callback: (name: string) => void;
}
type RegisterFormState = {
    name: string;
    //roomId: string;
    validationMessage?: string;
    isRegistering?: boolean;
}

export class RegisterForm extends React.Component<RegisterFormProps, RegisterFormState> {
    constructor(props: RegisterFormProps) {
        super(props);

        this.state = {
            name: props.defaultName || '',
            //roomId: (props.defaultRoomId != null && this.validateRoomId(props.defaultRoomId) ? props.defaultRoomId : '')
        };
    }

    onNameChange(name: string) {
        if (!this.state.isRegistering) {
            this.setState({
                name: name
            });
        }
    }
    onRoomIdChange(roomId: string) {
        if (!this.state.isRegistering && /^[A-Z]*$/g.test(roomId)) {
            this.setState({
                //roomId: roomId
            });
        }
    }

    handleEnter(e: React.KeyboardEvent) {
        if (e.key == "Enter" && !this.state.isRegistering) {
            this.register();
        }
    }

    validateRoomId(roomId: string) {
        return /^[A-Z]{3,}$/g.test(roomId);
    }

    register() {
        let messages: string[] = [];
        if (this.state.name.length < 3) {
            messages.push("The username must be atleast 3 characters long.");
        }
        //else if (this.state.roomId.length < 3) {
        //    messages.push("The room ID must be atleast 3 characters long.");
        //}
        //else if (!this.validateRoomId(this.state.roomId)) {
        //    messages.push("The room ID may only contain uppercase letters.");
        //}

        if (messages.length > 0) {
            this.setState({
                validationMessage: messages.join('<br>')
            });
        }
        else {
            this.setState({
                isRegistering: true
            });

            this.props.callback(this.state.name);
        }
    }

    render() {
        let validationMessage = this.state.validationMessage != null
            ? <p className="max-w-xs px-6 mb-2 text-center text-red-500">{this.state.validationMessage}</p> : "";

        let nameInput = <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full my-1 focus:outline-none ring-1 ring-gray-300"
            value={this.state.name} placeholder="Username" autoFocus onChange={e => this.onNameChange(e.target.value)} onKeyUp={this.handleEnter.bind(this)}/>
        //let roomIdInput = this.props.defaultRoomId == null || this.props.defaultRoomId != this.state.roomId
        //    ? <input className="block shadow-inner bg-gray-50 text-gray-800 py-1 px-3 rounded-full my-1 focus:outline-none ring-1 ring-gray-300"
        //        value={this.state.roomId} placeholder="Room ID" onChange={e => this.onRoomIdChange(e.target.value)} onKeyUp={this.handleEnter.bind(this)} /> : "";

        let joinButton = this.state.isRegistering
            ? <a className="mt-2 bg-gray-300 rounded-full text-white text-center font-bold py-1.5 transition cursor-wait focus:outline-none" tabIndex={-1}
            >Play!</a>
            : <button className="mt-2 bg-green-400 rounded-full text-white text-center font-bold py-1.5 transition cursor-pointer focus:bg-green-500 hover:bg-green-500 focus:outline-none"
                id="join" onClick={() => this.register()}>Play!</button>

        return <div id="panel" className="relative m-auto">
            <div className="absolute rounded-xl shadow-lg inset-3 bg-gray-300 transform translate-y-5"></div>
            <div className="relative flex flex-col justify-items-center rounded-xl shadow-lg bg-gray-100 px-32 py-10">
                <h1 className="text-3xl text-center font-bold mb-4">Play Codenames!</h1>
                <p className="text-center mb-2">{i18n.current.testMessage}</p>
                {validationMessage}
                {nameInput}
                {/* {roomIdInput} */}
                {joinButton}
            </div>
        </div>
    }
}

export function show(container: Element, callback: (name: string) => void) {
    const urlParams = new URLSearchParams(window.location.search);
    ReactDOM.render(<RegisterForm
        defaultName={urlParams.get('name')}
        // defaultRoomId={urlParams.get('room')}
        callback={callback} />, container);
}
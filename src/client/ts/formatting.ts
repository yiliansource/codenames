import React from "react";
import i18n, { LangKey } from "./i18n";

import { Player, TeamColour } from "../../shared/codenames";

export function createFormatContainer(content: string) {
    return React.createElement("span", { dangerouslySetInnerHTML: { __html: content }, className: "format-container" });
}

export function formatTeam(team: TeamColour) {
    return `<span class="font-bold ${team === TeamColour.Red ? "text-red-500" : "text-blue-500"}">
        ${i18n.format(team === TeamColour.Red ? LangKey.TeamRed : LangKey.TeamBlue)}</span>`;
}

export interface PlayerFormattingOptions {
    colourName?: boolean;
}
export function formatPlayer(player: Player, options?: PlayerFormattingOptions) {
    if (!options) {
        options = {
            colourName: true
        }
    }

    let isRedTeam = player.team === TeamColour.Red;
    return `<span style="display: inline-block; margin: 0 0.1rem;" ${options.colourName ? ` class="${isRedTeam ? "text-red-500" : "text-blue-500"}"` : ''}>
        <span>${player.name}</span>
        ${ player.isHost ? `<i title=${i18n.format(LangKey.Host)} class="text-yellow-500 fas fa-crown"></i>` : '' }
        ${ player.isGameMaster ? `<i title=${i18n.format(LangKey.GameMaster)} class="fas fa-hat-wizard ${isRedTeam ? "text-red-500" : "text-blue-500"}"></i>` : '' }
        </span>`;
}
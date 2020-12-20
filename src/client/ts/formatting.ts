import { TeamColour } from "../../shared/codenames";

import i18n, { LangKey } from "./i18n";

export function formatTeam(team: TeamColour) {
    return `<span class="font-bold ${team === TeamColour.Red ? "text-red-500" : "text-blue-500"}">
        ${i18n.format(team === TeamColour.Red ? LangKey.TeamRed : LangKey.TeamBlue)}</span>`;
}
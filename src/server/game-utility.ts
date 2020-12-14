import { TeamColour } from "../shared/codenames";

export function generateCardColours(cardsPerTeam: number, assassins: number, startingTeam: TeamColour): TeamColour[] {
    return []
        .concat(...Array(cardsPerTeam + (startingTeam == TeamColour.Red ? 1 : 0)).fill(TeamColour.Red))
        .concat(...Array(cardsPerTeam + (startingTeam == TeamColour.Blue ? 1 : 0)).fill(TeamColour.Blue))
        .concat(...Array(assassins).fill(TeamColour.Black))
        .concat(...Array(25 - (cardsPerTeam * 2 + 1 + assassins)).fill(TeamColour.White))
        .sort((a, b) => 0.5 - Math.random()); // maybe opt in for a different randomization
}
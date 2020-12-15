import shuffle from "shuffle-array";
import { TeamColour } from "../../shared/codenames";

/**
 * Returns a random team colour (red/blue). Similar to a coinflip.
 */
export function randomTeam(): TeamColour {
    return Math.random() < 0.5 ? TeamColour.Red : TeamColour.Blue;
}

/**
 * Generates a solution array, according to Codename's rules.
 * @param totalCards The total number of cards to generate.
 * @param cardsPerTeam The cards that each team will get. Note that the starting team will have one more.
 * @param assassins The number of assassin cards to place.
 * @param startingTeam The team that starts off.
 */
export function generateSolution(totalCards: number, cardsPerTeam: number, assassins: number, startingTeam: TeamColour): TeamColour[] {
    let blankCards = totalCards - (cardsPerTeam * 2 + 1 + assassins);
    if (blankCards < 0) {
        throw new Error(`The total amount of cards may not be less than ${blankCards + totalCards} with the specified configuration.`);
    }

    return shuffle([]
        .concat(...Array(cardsPerTeam + (startingTeam == TeamColour.Red ? 1 : 0)).fill(TeamColour.Red))
        .concat(...Array(cardsPerTeam + (startingTeam == TeamColour.Blue ? 1 : 0)).fill(TeamColour.Blue))
        .concat(...Array(assassins).fill(TeamColour.Black))
        .concat(...Array(blankCards).fill(TeamColour.White)));
}
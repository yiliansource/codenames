import { Card, GamePhase, GameState, Player, TeamColour } from "../../../shared/codenames";
import { GameAction } from "../actionHandler";

import { randomTeam, generateSolution } from "../solutionProvider";
import { getWords } from "../wordProvider";

const cardAmount = 25;

/**
 * Represents an action that is performed when the host(!) wants to start the game.
 * 
 * Performs a check to see if the player has permissions to start.
 * 
 * Also starts a new round, if the request was valid.
 */
const StartGameAction: GameAction = {
    name: "startGame",
    execute: (caller: Player, game: GameState, data: any) => {
        game.phase = GamePhase.Round;

        game.players.find(p => p.team === TeamColour.Red)!.isGameMaster = true;
        game.players.find(p => p.team === TeamColour.Blue)!.isGameMaster = true;

        let startingTeam = randomTeam();
        let words = getWords(game.language, cardAmount);
        let solutions = generateSolution(cardAmount, 7, 1, startingTeam);
        game.cards = words.map((word: string, index: number) => <Card>{ content: word, colour: solutions[index] });
        game.inTurn = startingTeam;

        return true;
    }
}
export default StartGameAction;
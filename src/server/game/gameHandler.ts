import chalk from "chalk";

import { randomTeam, generateSolution } from "./solutionProvider";
import { getWords } from "./wordProvider";

import { Card, GamePhase, GameState, Hint, Player, TeamColour } from "../../shared/codenames";

const gameDefaults = {
    totalCardAmount: 25,
    cardsPerTeam: 7,
    assassins: 1
};

/**
 * Provides an interface to perform actions on a game state, using a specified acting player.
 */
interface GameHandler {
    /**
     * Switches the acting player from the current team to a new one.
     */
    switchTeam: (team: TeamColour) => void;
    /**
     * Starts a new round.
     */
    startRound: () => void;
    /**
     * Submits a hint to the round.
     */
    submitHint: (hint: Hint) => void;
    /**
     * Reveals the card at the specified index. Also advances the game progress, if needed.
     */
    revealCard: (index: number) => void;
    /**
     * Passes the turn to the next team.
     */
    advanceTurn: () => void;
    /**
     * Ends the game, using a specified winner.
     */
    endGame: (winner: TeamColour) => void;
}

export function createGameHandler(caller: Player, game: GameState): GameHandler {
    return {
        switchTeam: function(team: TeamColour) {
            if (team != TeamColour.Red && team != TeamColour.Blue) {
                throw new Error(`Invalid team colour '${team}'.`);
            }

            caller.team = team;
            console.log(chalk.white`${caller} switched to team ${team}.`);
        },
        startRound: function() {
            game.round++;
            game.phase = GamePhase.Round;
            game.hint = null;
            game.hintHistory = [];
            
            const setGameMaster = (team: TeamColour) => {
                game.players.filter(p => p.team === team).forEach((player, index, array) => {
                    player.isGameMaster = index == (game.round % array.length);
                });
            }
            setGameMaster(TeamColour.Red);
            setGameMaster(TeamColour.Blue);
            
            let startingTeam = randomTeam();
            let words = getWords(game.language, gameDefaults.totalCardAmount);
            let solutions = generateSolution(gameDefaults.totalCardAmount, gameDefaults.cardsPerTeam, gameDefaults.assassins, startingTeam);

            game.cards = words.map((word: string, index: number) => <Card>{ content: word, colour: solutions[index] });
            game.inTurn = startingTeam;
        },
        submitHint: function(hint: Hint) {
            game.hint = hint;
            game.hintHistory.push(hint);
            
            console.log(chalk.green`${caller} submitted a hint: ${chalk.yellow(JSON.stringify(hint))}`);
        },
        revealCard: function(index: number) {
            if (!game.cards) {
                throw new Error("An attempt to reveal a card was made, but no cards have been created yet.");
            }

            console.log(chalk.white`${caller} revealed the card ${index} (${game.cards[index].content}).`);

            const card = game.cards[index];
            card.isConsumed = true;

            if (card.colour === TeamColour.Black) {
                this.endGame(game.inTurn === TeamColour.Red ? TeamColour.Blue : TeamColour.Red);
                console.log(chalk.red`   --> Card was an assassin. Team ${caller.team} lost.`);
            }
            else if (caller.team !== card.colour) {
                this.advanceTurn();
                console.log(chalk.red`   --> Card was not ${caller.team}. Switching turn to the other team.`);
            }
            else {
                if (game.cards.filter(c => c.colour === caller.team).every(c => c.isConsumed)) {
                    this.endGame(caller.team);
                    console.log(chalk.green`   --> Team ${caller.team} won by revealing all their cards!`);
                }
                else {
                    console.log(chalk.green`   --> Card was the same colour (${caller.team}), keep guessing!`);
                }
            }
        },
        advanceTurn: function() {
            game.hint = null;
            game.inTurn = (game.inTurn === TeamColour.Red ? TeamColour.Blue : TeamColour.Red);
        },
        endGame: function(winner: TeamColour) {
            game.phase = GamePhase.Over;
            game.winnerHistory.push(winner);
        }
    };
}
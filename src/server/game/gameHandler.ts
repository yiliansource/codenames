import { GameState, TeamColour } from "../../shared/codenames";

export default class GameHandler {
    private game: GameState;

    private constructor(game: GameState) {
        this.game = game;
    }

    public static fromState(game: GameState): GameHandler {
        return new GameHandler(game);
    }

    public startRound() {

    }
    public revealCard(index: number) {
        
    }
    public advanceTurn() {
        this.game.inTurn = (this.game.inTurn === TeamColour.Red ? TeamColour.Blue : TeamColour.Red);
    }
}
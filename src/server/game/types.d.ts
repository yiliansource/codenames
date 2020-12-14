import { GameState, Player } from "../../shared/codenames";

export interface GameAction {
    name: string;
    handle: (caller: Player, game: GameState, data: any) => boolean;
}
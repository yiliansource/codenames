import { MouseEvent } from "react";
import { Player, Card, TeamColour } from "../../shared/codenames";

type HintProps = { 
    message: string; 
}

type TeamProps = {
    players: Player[];
    colour: TeamColour;
    cards: Card[];
}

type CardGridProps = {
    cards: Card[];
    onClick: (index: number) => void;
}

type CardProps = {
    card: Card;
    onClick: (event: MouseEvent) => void;
}
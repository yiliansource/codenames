<center>

<h1>Codenames</h1>

<p>
    <i>A website to play the team-based word-guessing game by the same name.</i><br>
    <i>Playable at <a href="https://codenames.yiliansource.dev">codenames.yiliansource.dev</a>!</i>
</p>

<p>Made in NodeJS using React, TypeScript and Socket.IO.</p>

<p>
    <a href="#development">Development</a> |
    <a href="#terminology">Terminology</a> |
    <a href="#example-game">Example Game</a>
</p>

</center>

## Development

The project uses `gulp` to manage the build tasks. To use it, make sure you have `gulp-cli` installed.

Building can be done via:

```bash
gulp build
```

This compiles all the resources, such as TypeScript or Sass into their built versions. If you need to clean the distribution folder beforehand, run `gulp clean`.

Running the project is possible both in development and production mode. Development mode has the added benefit of watching for changes and refreshing the browser once one occurs.

Development mode can be started via:

```bash
gulp
```

Production mode is started, after building, simply via:

```bash
npm start
```

## Terminology

Defined here are a few terms that occur during the game:

- **Card**: Essentially just a word. Every card has an assigned colour, which indicates the team that is intended to guess that specific card. See [card colours](#card-colours) for more information.
- **Card Grid**: The card grid is an enumerable collection of NxM cards, 5x5 by default.
- **Solution**: The solution is not a seperate entity, but rather a consequence of the cards inside the grid. It's a collection of NxM colours, corresponding to the card colours.
- **Player**: A player is a human-controlled entity in the game. Players can interact with the game via their browser client.
- **Game Master**: Subset of players. Game Masters are the players in the game that have the responsibility of distributing hints to other players. As a logical consequence, they have to be provided with the "solution" to the cards, and taken their functionality to vote on cards.

### Card Colours

- **White**: A blank card. Does not belong to any team. If any teams guesses this card as theirs, their turn is ended with no consequence.
- **Black**: An assassin card. Does not belong to any team. If any team guesses this card as theirs, they have automatically lost the game.
- **Red/Blue**: The team colours. If the corresponding team guesses this card as theirs, their score is increased and their turn continues.

## Example Game

**Pre-Game Phase**

The game starts with four players in the lobby, two on each team. 25 cards (5x5) are distributed onto the grid, with random words chosen from a dictionary set. A random variable decides that Team Red has one additional card to guess, but gets to first as compensation.

The first players in each teams are decided as the game masters. To them, the solutions of the cards are revealed.

**Game Phase Starts**

The Game Master from Team Red is prompted to input a hint word and target amount. All other players (including the other Game Master) are prohibited from any actions.

Once the hint word is submitted, all remaining players from Team Red (just one, in this case) are prompted to vote on the card they think the hint refers to.

After a card is nominated, one of three scenarios occurs:

1. The card belongs to the team that voted on the card. Hooray! They can keep guessing as long as they like, or end their turn.
2. The card belongs to the other team or no team at all. In this case their turn is ended.
3. The card belongs to the assassin. In this case the game is immediately over, and the opposing team gains the victory.

Then it's the other team's turn. this procedure is repeated until either an assassin card is picked or a team discovered all their cards.

**Post-Game Phase**

The winning team gains a scorepoint. The game master index is increased, which causes the next player of each team to become game master next round. Then a new round starts (pre-game phase!). This is repeated as long as desired.

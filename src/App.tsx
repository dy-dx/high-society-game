import { Client } from 'boardgame.io/react';
import { Debug } from 'boardgame.io/debug';

import { HighSociety } from './Game';
import { Board } from './Board';

const App = Client({ game: HighSociety, board: Board, numPlayers: 3, debug: { impl: Debug } });

export default App;

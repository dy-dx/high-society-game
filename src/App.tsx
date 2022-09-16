import { Client } from 'boardgame.io/react';

import { HighSociety } from './Game';
import { Board } from './Board';

const App = Client({ game: HighSociety, board: Board, numPlayers: 3 });

export default App;

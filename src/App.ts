import { Client } from 'boardgame.io/react';

import { TicTacToe } from './Game';
import { Board } from './Board';
import './App.css';

const App = Client({ game: TicTacToe, board: Board });

export default App;

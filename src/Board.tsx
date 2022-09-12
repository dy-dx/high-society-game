import React from 'react';
import type { BoardProps } from 'boardgame.io/react';
import type { Ctx } from 'boardgame.io';
import type { TicTacToeState } from './Game';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

interface TicTacToeProps extends BoardProps<TicTacToeState> {}

export const Board = ({ G, ctx, moves }: TicTacToeProps) => {
  let winner = getWinner(ctx);

  return (
    <main>
      <h1>boardgame.io Typescript Demo</h1>

      <div
        style={{
          display: 'grid',
          gridTemplate: 'repeat(3, 3rem) / repeat(3, 3rem)',
          gridGap: '0.3em',
        }}
      >
        {G.cells.map((cell, index) => (
          <button key={index} onClick={() => moves.clickCell(index)} disabled={cell !== null}>
            {cell}
          </button>
        ))}
      </div>

      {winner && <p>{winner}</p>}
    </main>
  );
};

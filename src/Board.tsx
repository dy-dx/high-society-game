import React from 'react';
import type { BoardProps } from 'boardgame.io/react';
import type { Ctx } from 'boardgame.io';
import { HighSocietyState, StatusCard, StatusOp } from './Game';

import Hand from './Hand';
import Statuses from './Statuses';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

interface HighSocietyProps extends BoardProps<HighSocietyState> {}

function displayEffect(c: StatusCard): string {
  if (c.op === StatusOp.Add) {
    return `${c.value > 0 ? '+' : ''}${c.value}`;
  }
  if (c.op === StatusOp.Multiply) {
    if (c.value >= 1) {
      return `x${c.value}`;
    }
    return `/${1 / c.value}`;
  }
  return `discard`;
}

export const Board = ({ G, ctx, moves }: HighSocietyProps) => {
  let winner = getWinner(ctx);

  const currentPlayerIndex = parseInt(ctx.currentPlayer, 10);

  return (
    <main>
      <h1>High Society</h1>

      <div style={{ fontFamily: 'monospace' }}>
        {G.players.map((p, index) => (
          <div key={index} style={{ opacity: p.hasPassed ? 0.5 : undefined }}>
            <pre style={{ fontWeight: index === currentPlayerIndex ? 'bold' : undefined }}>
              {p.name}
              {p.hasPassed && ' (passed)'}
            </pre>
            <Hand
              G={G}
              ctx={ctx}
              moves={moves}
              player={p}
              isCurrentPlayer={!ctx.gameover && index === currentPlayerIndex}
            />
            <Statuses player={p} />
            <hr />
          </div>
        ))}
        <pre>deck size: {G.deck.length}</pre>
        {G.deck.length && (
          <div>
            <div>top card: {G.deck[0].name}</div>
            <div>type: {G.deck[0].type}</div>
            <div>effect: {displayEffect(G.deck[0])}</div>
          </div>
        )}
      </div>

      <pre>current bid: {G.currentBid}</pre>

      {winner && <p>{winner}</p>}
    </main>
  );
};

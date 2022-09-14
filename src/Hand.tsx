import React, { useState } from 'react';
import type { BoardProps } from 'boardgame.io/react';
import { canPlayerTake, mustPlayerDiscardAfterTaking } from './Game';
import { HighSocietyState, PlayerState, StatusType } from './Game';

interface HandProps extends Pick<BoardProps<HighSocietyState>, 'G' | 'ctx' | 'moves'> {
  player: PlayerState;
  isCurrentPlayer: boolean;
}

function sumArray(arr: number[]) {
  return arr.reduce((acc, n) => acc + n, 0);
}

const Hand = ({ G, ctx, moves, player, isCurrentPlayer }: HandProps) => {
  const [selectedCards, selectCards] = useState<number[]>([]);
  const selectedCardValues = selectedCards.map((i) => player.hand[i]);
  const proposedBid = sumArray(selectedCardValues) + sumArray(player.bidMoney);

  const canTake = isCurrentPlayer && canPlayerTake(player, G);
  const mustTake = canTake && G.deck[0].type !== StatusType.Disgrace;
  const canBid = isCurrentPlayer && !mustTake && proposedBid > G.currentBid;

  const mustDiscard = canTake && mustPlayerDiscardAfterTaking(player, G.deck[0]);

  return (
    <div style={{ display: 'flex' }}>
      hand:
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '50px',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '280px',
            lineHeight: '20px',
          }}
        >
          {player.hand.map((c, index) => {
            const isSelected = selectedCards.includes(index);
            return (
              <button
                key={index}
                disabled={!isCurrentPlayer || mustTake}
                onClick={() => {
                  const cards = selectedCards.slice();
                  if (cards.includes(index)) {
                    const foo = cards.indexOf(index);
                    cards.splice(foo, 1);
                  } else {
                    cards.push(index);
                  }
                  selectCards(cards);
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  padding: 0,
                  marginLeft: '6px',
                  fontSize: '12px',
                  // border: '1px solid black',
                  textAlign: 'center',
                  backgroundColor: isSelected ? 'lightskyblue' : undefined,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div>
          <button
            onClick={() => {
              canTake ? moves.take() : moves.pass();
              selectCards([]);
            }}
            disabled={!isCurrentPlayer}
            style={{ marginLeft: '6px' }}
          >
            {canTake ? `take${mustDiscard ? ' and discard' : ''}` : 'pass'}
          </button>
          <button
            onClick={() => {
              moves.bid(selectedCards);
              selectCards([]);
            }}
            disabled={!canBid}
            style={{ marginLeft: '6px' }}
          >
            bid ${proposedBid}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hand;

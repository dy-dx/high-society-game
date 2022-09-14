import React from 'react';
import { playerScore, PlayerState, StatusCard, StatusOp } from './Game';

function sumArray(arr: number[]) {
  return arr.reduce((acc, n) => acc + n, 0);
}

function shortName(c: StatusCard): string {
  if (c.op === StatusOp.Add) {
    return `${c.value}`;
  }
  if (c.op === StatusOp.Multiply) {
    if (c.value >= 1) {
      return `x${c.value}`;
    }
    return `/${1 / c.value}`;
  }
  return `${c.value}`;
}

const Statuses = ({ player: p }: { player: PlayerState }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
      <div
        style={{
          display: 'flex',
          lineHeight: '20px',
        }}
      >
        <span>status&nbsp;cards:</span>
        <div style={{ display: 'flex' }}>
          {p.statusCards.map((c, index) => (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                padding: 0,
                fontSize: '12px',
                border: '1px solid black',
                borderRadius: '2px',
                textAlign: 'center',
                marginLeft: '5px',
                backgroundColor: c.op === StatusOp.Multiply ? 'lawngreen' : undefined,
              }}
            >
              {shortName(c)}
            </div>
          ))}
        </div>
      </div>
      <div>money: {sumArray(p.hand) + sumArray(p.bidMoney)}</div>
      <div>score: {playerScore(p)}</div>
    </div>
  );
};
export default Statuses;

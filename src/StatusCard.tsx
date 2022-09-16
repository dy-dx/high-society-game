import React from 'react';
import { StatusCard as IStatusCard, StatusOp } from './Game';
import imageSrcs from './imageSrcs';

function shortName(c: IStatusCard): string {
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

const StatusCard = ({ card: c }: { card: IStatusCard }) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', width: 'min-content' }}
    >
      <div
        style={{
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <img src={imageSrcs[c.id]} alt={shortName(c)} style={{ height: '100%', width: 'auto' }} />
      </div>
    </div>
  );
};
export default StatusCard;

import { INVALID_MOVE } from 'boardgame.io/core';
import type { Game, Ctx } from 'boardgame.io';

const moneyCards = [1, 2, 3, 4, 6, 8, 10, 12, 15, 20, 25];

export enum StatusType {
  Luxury = 'LUXURY',
  Prestige = 'PRESTIGE',
  Disgrace = 'DISGRACE',
}
export enum StatusOp {
  Add = 'ADD',
  Multiply = 'MULTIPLY',
  Discard = 'DISCARD',
}
export enum StatusCardId {
  luxury1 = 0,
  luxury2,
  luxury3,
  luxury4,
  luxury5,
  luxury6,
  luxury7,
  luxury8,
  luxury9,
  luxury10,
  prestigeAvantgarde,
  prestigeBonvivant,
  prestigeJoiedevivre,
  disgraceFauxpas,
  disgracePasse,
  disgraceScandale,
}
export interface StatusCard {
  id: StatusCardId;
  name: string;
  value: number;
  type: StatusType;
  op: StatusOp;
}
const luxuryCards: StatusCard[] = [
  { value: 1, id: StatusCardId.luxury1, name: 'EAU DE PARFUM' },
  { value: 2, id: StatusCardId.luxury2, name: 'CHAMPAGNE' },
  { value: 3, id: StatusCardId.luxury3, name: 'HAUTE CUISINE' },
  { value: 4, id: StatusCardId.luxury4, name: 'CASINO' },
  { value: 5, id: StatusCardId.luxury5, name: 'COUTURE' },
  { value: 6, id: StatusCardId.luxury6, name: 'VACANCES' },
  { value: 7, id: StatusCardId.luxury7, name: `OBJET D'ART` },
  { value: 8, id: StatusCardId.luxury8, name: 'BIJOUX' },
  { value: 9, id: StatusCardId.luxury9, name: 'DRESSAGE' },
  { value: 10, id: StatusCardId.luxury10, name: 'TOURNEÉ EN VOILIER' },
].map((c) => ({ ...c, op: StatusOp.Add, type: StatusType.Luxury }));

const prestigeCards = [
  { value: 2, id: StatusCardId.prestigeAvantgarde, name: 'AVANT GARDE' },
  { value: 2, id: StatusCardId.prestigeBonvivant, name: 'BON VIVANT' },
  { value: 2, id: StatusCardId.prestigeJoiedevivre, name: 'JOIE DE VIVRE' },
].map((c) => ({ ...c, op: StatusOp.Multiply, type: StatusType.Prestige }));

const disgraceCards = [
  { id: StatusCardId.disgraceFauxpas, op: StatusOp.Discard, value: -1, name: 'FAUX PAS!' },
  { id: StatusCardId.disgraceScandale, op: StatusOp.Multiply, value: 0.5, name: 'SCANDALE!' },
  { id: StatusCardId.disgracePasse, op: StatusOp.Add, value: -5, name: 'PASSÉ!' },
].map((c) => ({ ...c, type: StatusType.Disgrace }));

const deck: StatusCard[] = [...luxuryCards, ...prestigeCards, ...disgraceCards];

export interface PlayerState {
  name: string;
  hand: number[];
  bidMoney: number[];
  spentMoney: number[];
  statusCards: StatusCard[];
  hasPassed: boolean;
}

export interface HighSocietyState {
  players: PlayerState[];
  deck: StatusCard[];
  currentBid: number;
}

export const HighSociety: Game<HighSocietyState> = {
  setup: (ctx) => {
    const players = ctx.playOrder.map((_, i) => {
      return {
        name: `player_${i}`,
        hand: moneyCards.slice(),
        bidMoney: [],
        spentMoney: [],
        statusCards: [],
        hasPassed: false,
      };
    });
    return { players, deck: ctx.random!.Shuffle(deck), currentBid: 0 };
  },

  turn: {
    order: {
      first: () => 0,
      next: (G, ctx) => {
        const activePlayers = ctx.playOrder
          .map((_id, playOrderPos) => ({
            playOrderPos,
            hasPassed: G.players[playOrderPos].hasPassed,
          }))
          .filter((p) => !p.hasPassed);

        if (!activePlayers.length) {
          throw new Error(`Can't determine next player`);
        }

        let nextActivePlayer = activePlayers.find((p) => p.playOrderPos > ctx.playOrderPos);
        if (!nextActivePlayer) {
          nextActivePlayer = activePlayers[0];
        }
        return nextActivePlayer.playOrderPos;
      },
    },
  },

  moves: {
    bid: (G, ctx, cardIdxs: number[]) => {
      const { hand, bidMoney } = getCurrentPlayer(G, ctx);
      const idxs = sortArray(cardIdxs.slice());
      const cardValues = idxs.map((i) => hand[i]);
      if (cardValues.some((v) => !v)) {
        return INVALID_MOVE;
      }

      const sum = sumArray(cardValues) + sumArray(bidMoney);
      if (sum <= G.currentBid) {
        return INVALID_MOVE;
      }
      for (let i = idxs.length - 1; i >= 0; i -= 1) {
        const idx = idxs[i];
        bidMoney.push(hand[idx]);
        hand.splice(idx, 1);
      }
      sortArray(bidMoney);
      G.currentBid = sum;
      ctx.events!.endTurn();
    },
    pass: (G, ctx) => {
      const player = getCurrentPlayer(G, ctx);
      if (player.hasPassed || canPlayerTake(player, G)) {
        return INVALID_MOVE;
      }
      player.hasPassed = true;
      const numBidCards = player.bidMoney.length;
      for (let i = 0; i < numBidCards; i += 1) {
        player.hand.push(player.bidMoney.pop()!);
      }
      sortArray(player.hand);
      ctx.events!.endTurn();
    },
    take: (G, ctx) => {
      const currentPlayer = getCurrentPlayer(G, ctx);
      if (!canPlayerTake(currentPlayer, G)) {
        return INVALID_MOVE;
      }
      const card = G.deck[0];
      currentPlayer.statusCards.push(card);
      G.deck.splice(0, 1);
      G.currentBid = 0;
      G.players.forEach((p) => {
        p.hasPassed = false;
        if (card.type === StatusType.Disgrace) {
          if (p === currentPlayer) {
            refundPlayerBid(p);
          } else {
            spendPlayerBid(p);
          }
        } else if (p === currentPlayer) {
          spendPlayerBid(p);
        }
      });

      if (mustPlayerDiscard(currentPlayer)) {
        // You always want to discard the lowest luxury card.
        discardLowest(currentPlayer);
      }

      ctx.playOrderPos -= 1;
      if (ctx.playOrderPos < 0) {
        ctx.playOrderPos = ctx.playOrder.length - 1;
      }
      ctx.events!.endTurn({ next: ctx.currentPlayer });
    },
  },

  endIf: (G, ctx) => {
    if (!isGameOver(G)) {
      return;
    }

    const winner = getWinner(G, ctx);
    if (!winner) {
      return { draw: true };
    }
    return { winner };
  },

  ai: {
    enumerate: (G, ctx) => {
      if (ctx.gameover) {
        return [];
      }
      const moves = [];
      const p = getCurrentPlayer(G, ctx);
      if (canPlayerTake(p, G)) {
        moves.push({ move: 'take' });
        // if it's not a disgrace card, and you can take it, then take it
        if (G.deck[0].type !== StatusType.Disgrace) {
          return moves;
        }
      } else {
        moves.push({ move: 'pass' });
      }
      // options for bidding a single card
      const playerCurrentBid = sumArray(p.bidMoney);
      p.hand.forEach((c, idx) => {
        const proposedBid = c + playerCurrentBid;
        // don't let the ai bid more than 40
        if (proposedBid > G.currentBid && proposedBid < 40) {
          moves.push({ move: 'bid', args: [[idx]] });
        }
      });
      return moves;
    },
  },
};

function sumArray(arr: number[]) {
  return arr.reduce((acc, n) => acc + n, 0);
}
function sortArray(arr: number[]) {
  return arr.sort((a, b) => a - b);
}

function getCurrentPlayer(G: HighSocietyState, ctx: Ctx) {
  const currentPlayerIndex = parseInt(ctx.currentPlayer, 10);
  return G.players[currentPlayerIndex];
}

function refundPlayerBid(p: PlayerState) {
  const numBidCards = p.bidMoney.length;
  if (numBidCards) {
    p.hand.push(...p.bidMoney);
    sortArray(p.hand);
    p.bidMoney = [];
  }
}

function spendPlayerBid(p: PlayerState) {
  const numBidCards = p.bidMoney.length;
  if (numBidCards) {
    p.spentMoney.push(...p.bidMoney);
    sortArray(p.spentMoney);
    p.bidMoney = [];
  }
}

export function playerScore(p: PlayerState) {
  let score = sumArray(p.statusCards.filter((c) => c.op === StatusOp.Add).map((c) => c.value));
  p.statusCards.filter((c) => c.op === StatusOp.Multiply).forEach((c) => (score *= c.value));
  return score;
}

export function canPlayerTake(p: PlayerState, G: HighSocietyState) {
  if (p.hasPassed) {
    return false;
  }
  const topCard = G.deck[0];
  if (topCard.type === StatusType.Disgrace) {
    return true;
  }
  return G.players.filter((p) => !p.hasPassed).length === 1;
}

function mustPlayerDiscard(p: PlayerState) {
  return (
    p.statusCards.find((c) => c.op === StatusOp.Discard) &&
    p.statusCards.find((c) => c.type === StatusType.Luxury)
  );
}

export function mustPlayerDiscardAfterTaking(p: PlayerState, c: StatusCard) {
  if (c.op === StatusOp.Discard) {
    return !!p.statusCards.find((c) => c.type === StatusType.Luxury);
  }
  if (c.type === StatusType.Luxury) {
    return !!p.statusCards.find((c) => c.op === StatusOp.Discard);
  }
  return false;
}

function discardLowest(p: PlayerState) {
  let lowestLuxCardIdx = -1;
  p.statusCards.forEach((c, idx) => {
    if (c.type !== StatusType.Luxury) return;
    if (lowestLuxCardIdx === -1) {
      lowestLuxCardIdx = idx;
    } else {
      const curLowestValue = p.statusCards[lowestLuxCardIdx].value;
      if (c.value < curLowestValue) {
        lowestLuxCardIdx = idx;
      }
    }
  });
  if (lowestLuxCardIdx === -1) {
    throw new Error('No luxury card to dsicard');
  }
  p.statusCards.splice(lowestLuxCardIdx, 1);
  const fauxPasIdx = p.statusCards.findIndex((c) => c.op === StatusOp.Discard);
  p.statusCards.splice(fauxPasIdx, 1);
}

function isGameOver(G: HighSocietyState): boolean {
  const topCard = G.deck[0];
  if (topCard.op !== StatusOp.Multiply) {
    return false;
  }
  let numGreenCards = 1;
  G.players.forEach((p) => {
    p.statusCards.forEach((c) => {
      if (c.op === StatusOp.Multiply) {
        numGreenCards += 1;
      }
    });
  });

  return numGreenCards === 4;
}

function getWinner(G: HighSocietyState, ctx: Ctx): string | null {
  const players = ctx.playOrder.map((id) => {
    const p = G.players[parseInt(id, 10)];
    return {
      id,
      hand: p.hand,
      statusCards: p.statusCards,
      remainingMoney: sumArray(p.hand),
      score: playerScore(p),
    };
  });
  // cast out poorest player(s)
  const lowestMoney = players.sort((a, b) => a.remainingMoney - b.remainingMoney)[0].remainingMoney;
  const remainingPlayers = players.filter((p) => p.remainingMoney > lowestMoney);
  if (!remainingPlayers.length) {
    return null;
  }
  // winner has most points (todo check for ties)
  remainingPlayers.sort((a, b) => a.score - b.score);
  return remainingPlayers.slice(-1)[0].id;
}

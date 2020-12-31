export interface Player {
  name: string;
  hp: number;
  mp: number;
  deck: Array<Card>;
  hand: Array<Card>;
  position: Position;
  isAction: boolean;
}

export interface Card {
  id: number;
  type: string;
  speed: number;
  cost: number;
  power: number;
  range: string;
  position: string;
  image: string;
  darkImage: string;
}

export enum PhaseNumber {
  FIRST = 0,
  MIDDLE = 1,
  LAST = 2,
}

export interface Position {
  x: number;
  y: number;
}

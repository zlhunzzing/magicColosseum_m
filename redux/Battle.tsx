import { createAction } from 'redux-actions';
import { Card } from '../common/interface/BattleInterface';
import CARD_DICTIONARY, {
  Deck1,
  Seki_Deck,
  Reti_Deck,
} from '../common/CardDictionary';
import store from '../redux'

const SELECT_PLAYER1 = 'App/Battle/SELECT_PLAYER1';
const SELECT_PLAYER2 = 'App/Battle/SELECT_PLAYER2';
const SET_PLAYER1_HAND = 'App/Battle/SET_PLAYER1_HAND';
const SET_PLAYER2_HAND = 'App/Battle/SET_PLAYER2_HAND';

export const select_player1 = createAction(SELECT_PLAYER1);
// payload: {name: Seki <string> }
export const select_player2 = createAction(SELECT_PLAYER2);
// payload: {name: Seki <string> }
export const set_player1_hand = createAction(SET_PLAYER1_HAND);
// payload: {hand: [{},{},{}] Array<Card> }
export const set_player2_hand = createAction(SET_PLAYER2_HAND);
// payload: {hand: [{},{},{}] Array<Card> }

const initialState = {
  Instance: class Character {
    name: string;
    hp: number;
    mp: number;
    def: number;
    deck: Array<object>;
    hand: Array<Card>;
    position: object;
    isAction: boolean;

    constructor(name: string, deck: Array<Card>) {
      this.name = name;
      this.hp = 100;
      this.mp = 100;
      this.def = 0;
      this.deck = deck;
      this.hand = [
        CARD_DICTIONARY.NONE,
        CARD_DICTIONARY.NONE,
        CARD_DICTIONARY.NONE,
      ];
      this.position = { x: 0, y: 1 };
      this.isAction = false;
    }
  },
  createCharacter: function (name: string, sequenceNum: number) {
    const character = new initialState.Instance(name, Deck1);
    if (name === '세키') character.deck = Seki_Deck;
    if (name === '레티') character.deck = Reti_Deck;

    if (sequenceNum === 1) {
      character.position = { x: 0, y: 1 };
    } else {
      character.position = { x: 3, y: 1 };
    }
    return character;
  },
  player1: {},
  player2: {},
  field: [
    [
      { effect: false },
      { effect: false },
      { effect: false },
    ],
    [
      { effect: false },
      { effect: false },
      { effect: false },
    ],
    [
      { effect: false },
      { effect: false },
      { effect: false },
    ],
    [
      { effect: false },
      { effect: false },
      { effect: false },
    ],
  ],
};

export default function Battle(state: any = initialState, action: any) {
  switch (action.type) {
    case SELECT_PLAYER1:
      return {
        ...state,
        player1: initialState.createCharacter(action.payload.name, 1),
      };
    case SELECT_PLAYER2:
      return {
        ...state,
        player2: initialState.createCharacter(action.payload.name, 2),
      };
    case SET_PLAYER1_HAND:
      return {
        ...state,
        player1: {
          ...state.player1,
          hand: action.payload.hand,
        },
      };
    case SET_PLAYER2_HAND:
      return {
        ...state,
        player2: {
          ...state.player2,
          hand: action.payload.hand,
        },
      };
    default:
      return state;
      
  }
}

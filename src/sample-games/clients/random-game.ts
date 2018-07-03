import { GameClient } from '@imagina/game-engine-client';
import { MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload } from '../types/random-game';

export const RandomGameClient = new GameClient<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}>({ apiUrl: 'https://demo-api.imaginagaming.com', gameCode: 'SAMPLE' });

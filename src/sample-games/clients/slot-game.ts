import { GameClient } from '@imagina/game-engine-client';
import { MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload } from '../types/slot-game';

export const SlotGameClient = new GameClient<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}>({ gameCode: 'SAMPLE_SLOT', gameKey: 'XKvSDCyQIRNGpgWLcuWSkw==', debug: true, json: true });

import { GameClient } from '@imagina/game-engine-client';
import { MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload } from '../types/random-game';

export const RandomGameClient = new GameClient<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}>({
	gameCode: 'SAMPLE',
	gameKey: 'hlGIh3c457nzhof7Ly4SFA==',
	debug: true,
	json: true
});

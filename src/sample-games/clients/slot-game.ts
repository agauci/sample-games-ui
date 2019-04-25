import { GameClient, GameMode } from '@imagina/game-engine-client';
import { MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload } from '../types/slot-game';

export const SlotGameClient = new GameClient<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}>({
	gameCode: 'SAMPLE_SLOT',
	gameKey: 'XKvSDCyQIRNGpgWLcuWSkw==',
	gameMode: GameMode.REAL,
	debug: true,
	json: true
});

import { GameMockPayloadConfig } from './common/mock-api';
import { MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload } from '../types/random-game';

export const RANDOM_GAME_CONFIG: GameMockPayloadConfig<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> = {
	protectedState: {
		number_generated: 5,
		rounds_won: 0,
		rounds_lost: 1
	},
	mutualState: {
		number_chosen: 2
	},
	balances: {
		credits_meter: 199
	},
	result: {
		credit_won: 10
	}
};

export default RANDOM_GAME_CONFIG;

import { GameMockPayloadConfig } from './common/mock-api';
import { MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, PlayerCoice } from '../types/slot-game';

export const SLOT_GAME_CONFIG: GameMockPayloadConfig<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> = {
	protectedState: {
		reel1: ['BAR', 'CROWN', 'WATERMELON'],
		reel2: ['CROWN', 'WATERMELON', 'GRAPES'],
		reel3: ['PLUM', 'PEAR', 'APPLE'],
	},
	mutualState: {
		player_choice: PlayerCoice.BET_5,
		reels_to_hold: [1, 3]
	},
	balances: {
		credits_meter: 199
	},
	result: {
		credit_won: 10
	}
};

export default SLOT_GAME_CONFIG;

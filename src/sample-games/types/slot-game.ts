export interface ReelDictionary<Type> {
	reel1: Type;
	reel2: Type;
	reel3: Type;
}

export const ReelIcons: ReelDictionary<string[]> = {
	reel1: ['SHAMROCK', 'BAR', 'PLUM', 'PLUM', 'SHAMROCK', 'SHAMROCK', 'PEAR', 'SHAMROCK', 'BAR', 'JACKPOT', 'JACKPOT', 'PLUM', 'JACKPOT', 'PLUM', 'GRAPES', 'GRAPES', 'CHERRIES', 'PEAR', 'CHERRIES', 'GRAPES', 'GRAPES', 'STRAWBERRY', 'CHERRIES', 'PEAR'],
	reel2: ['CHERRIES', 'STRAWBERRY', 'GRAPES', 'PLUM', 'PLUM', 'CHERRIES', 'PEAR', 'BAR', 'PLUM', 'BAR', 'PEAR', 'JACKPOT', 'SHAMROCK', 'GRAPES', 'SHAMROCK', 'STRAWBERRY', 'STRAWBERRY', 'SHAMROCK', 'PLUM', 'JACKPOT', 'STRAWBERRY', 'CHERRIES', 'STRAWBERRY', 'GRAPES'],
	reel3: ['STRAWBERRY', 'PEAR', 'CHERRIES', 'STRAWBERRY', 'CHERRIES', 'BAR', 'BAR', 'PEAR', 'STRAWBERRY', 'CHERRIES', 'BAR', 'GRAPES', 'PEAR', 'BAR', 'JACKPOT', 'PEAR', 'PEAR', 'SHAMROCK', 'PLUM', 'GRAPES', 'GRAPES', 'BAR', 'SHAMROCK', 'BAR']
};

export enum PlayerCoice {
	BET_1 = 'BET_1',
	BET_5 = 'BET_5',
}

export interface ProtectedStatePayload {
	reel1: string[];
	reel2: string[];
	reel3: string[];
}

export interface MutualStatePayload {
	player_choice: PlayerCoice,
	reels_to_hold?: number[] // 1, 2, 3
}

export interface BalancesPayload {
	credits_meter: number;
	win_meter: number;
}

export interface GameRoundResultPayload {
	credit_won: number;
}

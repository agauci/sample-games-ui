export interface ProtectedStatePayload {
	number_generated: number,
	rounds_won: number,
	rounds_lost: number
}

export interface MutualStatePayload {
	number_chosen: number
}

export interface BalancesPayload {
	credits_meter: number
}

export interface GameRoundResultPayload {
	credit_won: number
}

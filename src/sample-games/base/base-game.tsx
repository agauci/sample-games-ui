import * as React from 'react';
import { Loader } from '../../components/index';
import { BaseComponent } from '../../components/base/base-component';
import { GameClient, GameSessionSharedState, GameSessionServerState, GameRoundResult } from '@imagina/game-engine-client';

export interface BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> {
	sharedState?: GameSessionSharedState<MutualStatePayload>,
	serverState?: GameSessionServerState<ProtectedStatePayload, BalancesPayload>;
	results?: GameRoundResult<GameRoundResultPayload>[],
	gameStarted: boolean;
	gameReady: boolean;
}

export abstract class BaseGame<
	MutualStatePayload,
	ProtectedStatePayload,
	BalancesPayload,
	GameRoundResultPayload,
	GameConfigurationPayload,
	State extends BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload>
		= BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload>
> extends BaseComponent<{}, State> {

	protected abstract gameClient: GameClient<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, GameConfigurationPayload>;

	renderGame(content: React.ReactNode) {
		return <div className='game' key='content'>{this.state.gameStarted ? content : <Loader />}</div>;
	}

}


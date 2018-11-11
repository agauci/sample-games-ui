import * as React from 'react';
import { Loader } from '../../components/index';
import { BaseComponent } from '../../components/base/base-component';
import { GameClient, GameResult, GameSessionState } from '@imagina/game-engine-client';

export interface BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameResultPayload> {
	gameState?: GameSessionState<MutualStatePayload, ProtectedStatePayload, BalancesPayload>
	gameResults?: GameResult<GameResultPayload>[],
	gameStarted: boolean;
	gameReady: boolean;
}

export abstract class BaseGame<
	MutualStatePayload,
	ProtectedStatePayload,
	BalancesPayload,
	GameResultPayload,
	GameConfigurationPayload,
	State extends BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameResultPayload>
		= BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameResultPayload>
> extends BaseComponent<{}, State> {

	protected abstract gameClient: GameClient<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameResultPayload, GameConfigurationPayload>;

	renderGame(content: React.ReactNode) {
		return <div className='game' key='content'>{this.state.gameStarted ? content : <Loader />}</div>;
	}

}


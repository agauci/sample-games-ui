import * as React from 'react';
import { Card, Row, Col } from 'antd';
import { BaseComponent } from './base/base-component';
import { GameClient, GameSessionServerState, GameSessionSharedState, GameActivity, GameRoundResult } from '@imagina/game-engine-client';

export interface GameStateViewerProps {
	gameClient: GameClient<any, any, any, any, any>
}

export interface GameStateViewerState {
	gameServerState?: GameSessionServerState<any, any>;
	gameSharedState?: GameSessionSharedState<any>;
	lastActivity?: GameActivity<any, any, any>;
	lastActivityResults?: GameRoundResult<any>[];
}

export class GameStateViewer extends BaseComponent<GameStateViewerProps, GameStateViewerState> {

	constructor(props) {
		super(props);
		this.state = {};
	}

	subscribeToGameClient = (gameClient: GameClient<any, any, any, any, any>) => {
		this.addSubscriptions(
			gameClient.selector.game.session.gameStateReady$.subscribe((state) => {
				this.setState({
					gameServerState: state.serverState,
					gameSharedState: state.sharedState
				});
			}),
			gameClient.selector.game.activity.gameActivityDone$.subscribe((result) => {
				this.setState({
					lastActivity: result.activity,
					lastActivityResults: result.activityResults
				});
			})
		);
	}

	componentWillMount() {
		this.subscribeToGameClient(this.props.gameClient);
	}

	componentWillReceiveProps(nextProps: GameStateViewerProps) {
		if (nextProps.gameClient && (!this.props.gameClient || (this.props.gameClient && this.props.gameClient !== nextProps.gameClient))) {
			this.setState({
				gameServerState: undefined,
				gameSharedState: undefined,
				lastActivity: undefined,
				lastActivityResults: undefined
			});
			this.clearSubscriptions();
			this.subscribeToGameClient(nextProps.gameClient);
		}
	}

	render() {
		return <Card title='Game State Viewer' bordered={false}>
			<div className='game-state-viewer'>
				<Row>
					<Col span={4}>
						<h3>Server State</h3>
						<pre>{JSON.stringify(this.state.gameServerState, null, 2)}</pre>
					</Col>
					<Col span={4}>
						<h3>Shared State</h3>
						<pre>{JSON.stringify(this.state.gameSharedState, null, 2)}</pre>
					</Col>
					<Col span={8}>
						<h3>Last Activity</h3>
						<pre>{JSON.stringify(this.state.lastActivity, null, 2)}</pre>
					</Col>
					<Col span={8}>
						<h3>Last Activity Results</h3>
						<pre>{JSON.stringify(this.state.lastActivityResults, null, 2)}</pre>
					</Col>
				</Row>
			</div>
		</Card>;
	}
}

export default GameStateViewer;

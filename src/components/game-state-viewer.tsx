import * as React from 'react';
import { Card, Row, Col } from 'antd';
import { BaseComponent } from './base/base-component';
import { GameClient, GameSessionServerState, GameSessionSharedState, GameActivity, GameResult } from '@imagina/game-engine-client';

export interface GameStateViewerProps {
	gameClient: GameClient<any, any, any, any, any>
}

export interface GameStateViewerState {
	gameServerState?: GameSessionServerState<any, any>;
	gameSharedState?: GameSessionSharedState<any>;
	lastActivity?: GameActivity<any, any, any>;
	lastActivityResults?: GameResult<any>[];
}

export class GameStateViewer extends BaseComponent<GameStateViewerProps, GameStateViewerState> {

	constructor(props) {
		super(props);
		this.state = {};
	}

	subscribeToGameClient = (gameClient: GameClient<any, any, any, any, any>) => {
		this.addSubscriptions(
			gameClient.selector.game.session.gameStateReady$.subscribe((state) => {
				if (state) {
					this.setState({
						gameServerState: state.serverState,
						gameSharedState: state.sharedState
					});
				}
			}),
			gameClient.selector.game.activity.gameActivityDone$.subscribe(({ gameActivity, gameActivityResults }) => {
				this.setState({
					lastActivity: gameActivity,
					lastActivityResults: gameActivityResults
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
					<Col span={12}>
						<Row>
							<Col lg={12}>
								<h3>Shared State</h3>
								<pre>{JSON.stringify(this.state.gameSharedState, null, 2)}</pre>
							</Col>
							<Col lg={12}>
								<h3>Server State</h3>
								<pre>{JSON.stringify(this.state.gameServerState, null, 2)}</pre>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row>
							<Col lg={12}>
								<h3>Last Activity Results</h3>
								<pre>{JSON.stringify(this.state.lastActivityResults, null, 2)}</pre>
							</Col>
							<Col lg={12}>
								<h3>Last Activity</h3>
								<pre>{JSON.stringify(this.state.lastActivity, null, 2)}</pre>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		</Card>;
	}
}

export default GameStateViewer;

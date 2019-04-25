import * as React from 'react';
import { Card } from 'antd';
import { GameClient } from '@imagina/game-engine-client';
import { GameClientPanel } from '@imagina/game-launcher';

export interface GameInterfaceProps {
	gameClient: GameClient<any, any, any, any, any>;
	gameComponent: React.ComponentType<any>;
}

export class GameInterface extends React.Component<GameInterfaceProps> {

	constructor(props) {
		super(props);
		this.state = {
			gameStarted: false,
			gameReady: false
		};
	}

	render() {
		const GameComponent = this.props.gameComponent;
		return <Card title='Game Interface' bordered={false}>
			<div className='game-interface'>
				<GameComponent></GameComponent>
				<GameClientPanel gameClient={this.props.gameClient} />
			</div>
		</Card>;
	}
}

export default GameInterface;

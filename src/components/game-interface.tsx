import * as React from 'react';
import { Card } from 'antd';

export interface GameInterfaceProps {
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
			</div>
		</Card>;
	}
}

export default GameInterface;

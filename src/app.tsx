import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Layout, Menu } from 'antd';
import { Route, Router, Switch } from 'react-router';
import { SlotGame, RandomGame, SlotGameClient, RandomGameClient } from './sample-games';
import { GameInterface, GameStateViewer } from './components';
import browserHistory from './history';
import { RouteComponentProps, withRouter } from 'react-router';

export interface AppState {
	activeGame?: string
}

@withRouter
export class App extends React.Component<{}, AppState> {

	constructor(props) {
		super(props);
		this.state = {};
	}

	get routerProps() {
		return this.props as RouteComponentProps<any>;
	}

	componentWillMount() {
		this.setState({
			activeGame: this.routerProps.location.pathname.replace(/^\/|\/$/g, '')
		});
	}

	onMenuItemClick = (menuItem) => {
		this.setState({
			activeGame: menuItem.key
		});
		browserHistory.push(menuItem.key);
	}

	render() {
		return <Router history={browserHistory}>
			<Layout className='layout' style={{ minHeight: '100vh' }}>
				<Layout.Header>
					<Menu
						theme='dark'
						mode='horizontal'
						style={{ lineHeight: '64px' }}
						onClick={this.onMenuItemClick}
						selectedKeys={[this.state.activeGame]}
					>
						<Menu.Item key='random-game'>Random Game</Menu.Item>
						<Menu.Item key='slot-game'>Slot Game</Menu.Item>
					</Menu>
				</Layout.Header>
				<Layout.Content style={{ padding: '30px', boxSizing: 'border-box' }}>
					<Switch>
						<Route exact path='/'>
							<h3>Please select a sample game from menu...</h3>
						</Route>
						<Route>
							<Switch>
								<Route exact path='/random-game'>
									<div>
										<GameInterface gameClient={RandomGameClient} gameComponent={RandomGame} />
										<GameStateViewer gameClient={RandomGameClient} />
									</div>
								</Route>
								<Route exact path='/slot-game'>
									<div>
										<GameInterface gameClient={SlotGameClient} gameComponent={SlotGame} />
										<GameStateViewer gameClient={SlotGameClient} />
									</div>
								</Route>
							</Switch>
						</Route>
					</Switch>
				</Layout.Content>
				<Layout.Footer style={{ textAlign: 'center' }}>
					Imagina Sample Games
			</Layout.Footer>
			</Layout>
		</Router>;
	}
}

export default App;

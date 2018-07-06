import * as React from 'react';
import times from 'lodash/times';
import isBoolean from 'lodash/isBoolean';
import { Row, Col, Button, Carousel } from 'antd';
import { ProtectedStatePayload, MutualStatePayload, BalancesPayload, GameRoundResultPayload } from './types/random-game';
import { RandomGameClient } from './clients/random-game';
import { BaseGame, BaseGameState } from './base/base-game';

export interface RandomGameState extends BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> {
	reel?: number;
	reelSpinning: boolean;
	bet: number;
	betWin: boolean | null;
	creditsBalance?: number;
}

export class RandomGame extends BaseGame<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}, RandomGameState> {

	resultReel: Carousel;
	betReel: Carousel;

	gameClient = RandomGameClient;

	constructor(props) {
		super(props);

		// Initialize game component state
		this.state = {
			gameStarted: false,
			gameReady: false,
			reelSpinning: false,
			bet: 0,
			betWin: null,
		};
	}

	get resultClass() {
		return isBoolean(this.state.betWin) ? (this.state.betWin ? 'blink-win' : 'blink-loss') : '';
	}

	componentDidMount() {
		this.addSubscriptions(
			// Subscribe to gameStarted selector to check when the game start procedure is ready
			this.gameClient.selector.game.session.gameStateStarted$.subscribe(({ serverState, sharedState }) => {
				// Set the initial game state
				this.setState({
					serverState: serverState,
					sharedState: sharedState,
					creditsBalance: serverState.balances.credits_meter
				});
				// Set the next activity parameters in case of an Autoplay
				this.gameClient.dispatcher.slotGame.setNextActivity({
					betCredits: 1,
					nextActivityParams: {
						type: 'BET',
						mutualState: sharedState.mutualState
					},
					autoPlayDelay: 2000
				});
				// Set the game as ready to inform the game engine that the frontend is ready to accept an activity
				this.gameClient.dispatcher.slotGame.setGameReady();
			}),

			this.gameClient.selector.game.activity.gameActivityStarted$.subscribe((activity) => {
				// Set the state of the component to be ready for initializing an action
				this.setState({
					serverState: undefined,
					betWin: null,
					creditsBalance: this.state.creditsBalance! - 1,
				});

				if (this.betReel) {
					this.betReel.goTo(activity.sharedState.mutualState.number_chosen);
				}

				this.gameClient.selector.game.activity.gameActivityDone$.delayAtLeastRandom(500, 1000).first().toPromise().then((result) => {
					// Set the state of the game component accordingly
					this.setState({
						sharedState: result.activity.sharedState,
						serverState: result.activity.serverState,
						results: result.activityResults,
					});
				});

				let counter = 0;
				let interval = setInterval(() => {
					// Check if component still mounted and terminate interval if not to avoid error
					if (!this.isMounted) {
						clearInterval(interval);
						return;
					}
					// Map count to a sequence from 1 to length of reel icons which repeats itself
					let number = counter % 10;
					// Change bet indicator to represent current bet (random or not)
					if (this.resultReel) {
						this.resultReel.goTo(number);
					}
					// Stop spinning when the serverState is available and when the reel is in the position that matches the result
					if (this.state.serverState && this.state.serverState.protectedState.number_generated === number) {
						clearInterval(interval);

						// Update state to show win/loss and updated balance
						this.setState({
							betWin: !!(this.state.results && this.state.results.length),
							creditsBalance: this.state.serverState.balances.credits_meter,
						});

						// Set the next activity parameters in case of an Autoplay
						if (this.state.sharedState) {
							this.gameClient.dispatcher.slotGame.setNextActivity({
								betCredits: 1,
								nextActivityParams: {
									type: 'BET',
									mutualState: this.state.sharedState && this.state.sharedState.mutualState,
								},
								autoPlayDelay: 2000
							});
						}
						// Let the game engine know that the frontend is ready from showing the result
						this.gameClient.dispatcher.slotGame.setGameReady();
					} else {
						counter++;
					}
				}, 115);
			}),

			// Subscribe to gameStarted$
			// This will fire when both the game engine and the game interface are started
			// It means that the interface is ready from loading the assets needed and the game engine is ready to accept the first activity
			this.gameClient.selector.game.global.gameStarted$.subscribe(gameStarted => {
				if (gameStarted) {
					this.setState({ gameStarted: gameStarted });
				}
			}),

			// Subscribe to gameReady$
			// This will fire when both the game engine and the game interface are ready
			// It means that the interface is ready from displaying the results of an activity needed and the game engine is ready to accept the next activity
			this.gameClient.selector.game.global.gameReady$.subscribe(gameReady => {
				this.setState({
					gameReady: gameReady
				});
			})
		);
		// Dispatch start game action
		RandomGameClient.dispatcher.slotGame.startGame();
	}

	componentWillUpdate() {
		// Upon game start set the game components in sync with the initial state
		if (this.state.serverState && this.state.sharedState) {
			if (this.betReel) {
				this.betReel.goTo(this.state.sharedState.mutualState.number_chosen);
			}
			if (this.resultReel) {
				this.resultReel.goTo(this.state.serverState.protectedState.number_generated);
			}
		}
	}

	onBetClick = () => {
		// Generate random number to bet is Bet Random is clicked
		let bet = Math.round(Math.random() * 9);

		// Set up mutual state for the game activity
		let mutualState: MutualStatePayload = {
			number_chosen: bet
		};

		// Dispatch new game activity with the mutual state
		RandomGameClient.dispatcher.slotGame.doActivity({
			type: 'BET',
			mutualState: mutualState
		});
	}

	render() {
		return this.renderGame(<div>
			<Row>
				<Col className={'blinkable ' + this.resultClass}>
					<Row>
						<Col className='reels'>
							<h4>RESULT</h4>
							<Col className='reel'>
								<Carousel vertical dots={false} speed={100} ref={(reel) => reel && (this.resultReel = reel)}>
									{times(10).map(num => <div key={num}><h3>{num}</h3></div>)}
								</Carousel>
							</Col>
						</Col>
					</Row>
					<Row>
						<Col className='bet' style={{ textAlign: 'center' }}>
							<h4>NUMBER CHOSEN</h4>
							<Carousel vertical dots={false} ref={(reel) => reel && (this.betReel = reel)}>
								{times(10).map(bet => <div key={bet}><h3>{bet}</h3></div>)}
							</Carousel>
						</Col>
					</Row>
					<Row>
						<Col className='credits'>
							<h4>CREDITS</h4>
							<h3>{this.state.creditsBalance}</h3>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col className='buttons'>
					<Button
						type='primary'
						size='large'
						onClick={() => this.onBetClick()}
						loading={!this.state.gameReady}
					>BET RANDOM</Button>
				</Col>
			</Row>
		</div>);
	}
}

export default RandomGame;

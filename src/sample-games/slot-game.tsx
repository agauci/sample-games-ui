import * as React from 'react';
import times from 'lodash/times';
import isBoolean from 'lodash/isBoolean';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import { Row, Col, Button, Carousel } from 'antd';
import { ProtectedStatePayload, MutualStatePayload, BalancesPayload, ReelIcons, PlayerCoice, GameRoundResultPayload } from './types/slot-game';
import { SlotGameClient } from './clients/slot-game';
import { BaseGame, BaseGameState } from './base/base-game';

export interface SlotGameState extends BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> {
	holdReels: number[];
	bet: PlayerCoice;
	betWin: boolean | null;
	creditsBalance?: number;

	// Used for hold disable check
	firstBet: boolean,
	prevWinBet: boolean,
	prevHoldBet: boolean
}

export interface ReelDictionary<Type> {
	reel1: Type;
	reel2: Type;
	reel3: Type;
}

export class SlotGame extends BaseGame<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}, SlotGameState> {

	container: HTMLDivElement;
	betReel: Carousel;
	resultReels: Partial<ReelDictionary<Carousel>> = {};
	playerChoices: PlayerCoice[] = [PlayerCoice.BET_1, PlayerCoice.BET_5];

	gameClient = SlotGameClient;

	constructor(props) {
		super(props);

		// Initialize game component state
		this.state = {
			gameStarted: false,
			gameReady: false,
			holdReels: [],
			bet: PlayerCoice.BET_1,
			betWin: null,
			firstBet: true,
			prevWinBet: false,
			prevHoldBet: false
		};
	}

	get resultClass() {
		return isBoolean(this.state.betWin) ? (this.state.betWin ? 'blink-win' : 'blink-loss') : '';
	}

	get holdsEnabled() {
		return !this.state.firstBet && !this.state.prevWinBet && !this.state.prevHoldBet;
	}

	componentWillMount() {
		this.addSubscriptions(
			// Subscribe to gameStarted selector to check when the game start procedure is ready
			// Make sure that unsubscribe from any subscription when closing a component
			this.gameClient.selector.game.session.gameStateStarted$.subscribe(({ serverState, sharedState }) => {
				this.setState({
					serverState: serverState,
					sharedState: sharedState,
					creditsBalance: serverState.balances.credits_meter
				});
				this.gameClient.dispatcher.slotGame.setNextActivity({
					betCredits: this.getBetCredits(sharedState.mutualState),
					nextActivityParams: {
						type: 'BET',
						mutualState: sharedState.mutualState
					},
					autoPlayDelay: 2000
				});
				this.gameClient.dispatcher.slotGame.setGameReady();
			}),

			this.gameClient.selector.game.activity.gameActivityStarted$.subscribe(() => {
				// Set the state of the component to be ready for initializing an action
				this.setState({
					serverState: undefined,
					betWin: null,
					creditsBalance: this.state.creditsBalance! - 1,
					firstBet: false,
					prevHoldBet: !!this.state.holdReels.length
				});

				this.gameClient.selector.game.activity.gameActivityDone$.delayAtLeastRandom(500, 1000).first().toPromise().then((result) => {
					// Set the state of the game component accordingly
					this.setState({
						sharedState: result.activity.sharedState,
						serverState: result.activity.serverState,
						results: result.activityResults,
						prevWinBet: !!result.activityResults.length,
					});
				});

				let reelsStopped: string[] = [];

				Object.keys(this.resultReels).forEach((reelID, reelIndex) => {
					// Check if reel is held (if yes return false)
					if (this.isReelHeld(reelIndex)) {
						reelsStopped.push(reelID);
					} else {
						let counter = 0;
						let interval = setInterval(() => {
							// Map count to a sequence from 1 to length of reel icons which repeats itself
							let iconIndex = counter % this.getReelIcons(reelIndex).length;
							let resultReel: Carousel = this.getReelCarousel(reelIndex);
							if (resultReel) {
								// Move reel carousel to show icon emmitted
								resultReel.goTo(iconIndex);
							}
							// Stop spinning when the serverState is available and when the reel is in the position that matches the result
							if (this.state.serverState && this.state.sharedState && isEqual(this.state.serverState.protectedState[reelID], this.getVisibleReelIcons(reelIndex, iconIndex))) {
								clearInterval(interval);
								reelsStopped.push(reelID);
								// Check if all reels stopped
								if (reelsStopped.length === 3) {
									// Update state to show win/loss and updated balance
									this.setState({
										betWin: !!(this.state.results && this.state.results.length),
										holdReels: this.state.sharedState.mutualState.reels_to_hold || [],
										creditsBalance: this.state.serverState.balances.credits_meter,
									});

									// Let the game engine know that the frontend is ready from showing the result
									this.gameClient.dispatcher.slotGame.setNextActivity({
										betCredits: this.getBetCredits(this.state.sharedState.mutualState),
										nextActivityParams: {
											type: 'BET',
											mutualState: this.state.sharedState.mutualState
										},
										autoPlayDelay: 2000
									});
									this.gameClient.dispatcher.slotGame.setGameReady();
								}
							} else {
								counter++;
							}
						}, 120);
					}
				});
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
	}

	componentDidMount() {
		// Dispatch start game action
		this.gameClient.dispatcher.slotGame.startGame();
	}

	componentWillUpdate() {
		// Upon game start set the game components in sync with the initial state
		if (this.state.firstBet && this.state.serverState && this.state.sharedState) {
			// Set the reels to the initial state
			if (Object.keys(this.resultReels).length === 3) {
				Object.keys(this.resultReels).forEach((reelID, reelIndex) => {
					let reelIcons = this.getReelIcons(reelIndex);
					let resultReel = this.getReelCarousel(reelIndex);
					reelIcons.forEach((_icon, iconIndex) => {
						if (this.state.serverState && isEqual(this.state.serverState.protectedState[reelID], this.getVisibleReelIcons(reelIndex, iconIndex)) && resultReel) {
							resultReel.goTo(iconIndex);
						}
					});
				});
			}
			// Set the bet to the initial state
			if (this.betReel) {
				switch (this.state.sharedState.mutualState.player_choice) {
					case PlayerCoice.BET_1: this.betReel.goTo(0); break;
					case PlayerCoice.BET_5: this.betReel.goTo(1); break;
				}
			}
		}
	}

	isReelHeld = (reelIndex: number): boolean => includes(this.state.holdReels, reelIndex + 1);

	getReelIndex = (reelIndex: number) => `reel${reelIndex + 1}`;

	getReelCarousel = (reelIndex: number) => this.resultReels[this.getReelIndex(reelIndex)];

	setReelCarousel = (reelIndex: number, carousel: Carousel) => this.resultReels[this.getReelIndex(reelIndex)] = carousel;

	getReelIcons = (reelIndex: number) => ReelIcons[this.getReelIndex(reelIndex)] as string[];

	getVisibleReelIcons = (reelIndex: number, iconIndex: number) => {
		let reelIcons = this.getReelIcons(reelIndex);
		return times(3)
			.map(offset => (iconIndex + offset < reelIcons.length) ? (iconIndex + offset) : (iconIndex + offset - reelIcons.length))
			.map(iconIndex => reelIcons[iconIndex]);
	}

	getBetCredits = (mutualState: MutualStatePayload) => {
		switch (mutualState.player_choice) {
			case PlayerCoice.BET_1: return 1;
			case PlayerCoice.BET_5: return 5;
		}
	}

	toggleReelHold = (reelIndex: number) => {
		let holdReels;
		if (this.isReelHeld(reelIndex)) {
			this.state.holdReels.splice(this.state.holdReels.indexOf(reelIndex + 1), 1);
			holdReels = this.state.holdReels;
		} else {
			holdReels = this.state.holdReels.length === 2 ? [reelIndex + 1] : [...this.state.holdReels, reelIndex + 1];
		}
		this.setState({
			holdReels: holdReels
		});
	}

	changeBet = () => {
		this.betReel.next();
	}

	onChangeBet = (current: number) => {
		this.setState({
			bet: this.playerChoices[current]
		});
	}

	onBetClick = () => {
		// Set up mutual state for the game activity
		let mutualState: MutualStatePayload = {
			player_choice: this.state.bet,
			reels_to_hold: this.state.holdReels
		};

		// Dispatch new game activity with the mutual state
		this.gameClient.dispatcher.slotGame.doActivity({
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
							<h4>REELS</h4>
							<Row>
								{times(3).map(reelIndex => <Col className='reel' span={8} key={reelIndex}>
									<Carousel vertical dots={false} speed={100} ref={(reel) => reel && this.setReelCarousel(reelIndex, reel)}>
										{this.getReelIcons(reelIndex)
											.map((_icon, iconIndex) => <div key={iconIndex}>{this.getVisibleReelIcons(reelIndex, iconIndex)
											.map((icon, index) => <img key={index} src={`images/symbols/${icon.toLowerCase()}.png`}/>)}</div>)}
									</Carousel>
									<Button disabled={!this.state.gameReady || !this.holdsEnabled} type={this.isReelHeld(reelIndex) ? 'primary' : 'default'} onClick={() => this.toggleReelHold(reelIndex)}>
										{this.isReelHeld(reelIndex) ? 'UNHOLD' : 'HOLD'}
									</Button>
								</Col>)}
							</Row>
						</Col>
					</Row>
					<Row>
						<Col className='bet'>
							<h4>BET</h4>
							<Carousel ref={(reel) => reel && (this.betReel = reel)} afterChange={this.onChangeBet}>
								{this.playerChoices.map(bet => <div key={bet}><h3>{bet}</h3></div>)}
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
						onClick={() => this.changeBet()}
						disabled={!this.state.gameReady}
					>CHANGE BET</Button>
					<Button
						type='primary'
						size='large'
						onClick={() => this.onBetClick()}
						loading={!this.state.gameReady}
					>SPIN REELS</Button>
				</Col>
			</Row>
		</div>);
	}
}

export default SlotGame;

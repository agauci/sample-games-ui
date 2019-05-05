import * as React from 'react';
import times from 'lodash/times';
import isBoolean from 'lodash/isBoolean';
import includes from 'lodash/includes';
import compact from 'lodash/compact';
import isEqual from 'lodash/isEqual';
import { Row, Col, Button, Carousel } from 'antd';
import { ProtectedStatePayload, MutualStatePayload, BalancesPayload, ReelIcons, PlayerCoice, GameRoundResultPayload } from './types/slot-game';
import { SlotGameClient } from './clients/slot-game';
import { BaseGame, BaseGameState } from './base/base-game';
import { Reel } from '../components/game/reel';

export interface SlotGameState extends BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> {
	holdReels: number[];
	betCredits: number;
	betWin: boolean | null;
	creditsBalance?: number;
	reelsSpinning: boolean;
	reelsStopped: string[];

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
	resultReels: Partial<ReelDictionary<Reel>> = {};
	playerChoices: PlayerCoice[] = [PlayerCoice.BET_1, PlayerCoice.BET_5];

	gameClient = SlotGameClient;

	constructor(props) {
		super(props);

		// Initialize game component state
		this.state = {
			gameStarted: false,
			gameReady: false,
			holdReels: [],
			betCredits: 1,
			betWin: null,
			firstBet: true,
			prevWinBet: false,
			prevHoldBet: false,
			reelsSpinning: false,
			reelsStopped: []
		};
	}

	get resultClass() {
		return isBoolean(this.state.betWin) ? (this.state.betWin ? 'blink-win' : 'blink-loss') : '';
	}

	get holdsEnabled() {
		return !this.state.firstBet && !this.state.prevWinBet && !this.state.prevHoldBet;
	}

	componentDidMount() {
		this.addSubscriptions(
			// Subscribe to gameStarted selector to check when the game start procedure is ready
			// Make sure that unsubscribe from any subscription when closing a component
			this.gameClient.selector.game.session.gameSessionStarted$.subscribe(({ gameState }) => {
				this.setState({
					gameState,
					creditsBalance: gameState!.serverState.balances.credits_meter
				});
				this.gameClient.dispatcher.slotGame.setGameReady();
			}),

			this.gameClient.selector.game.activity.gameActivityStarted$.subscribe(() => {
				// Set the state of the component to be ready for initializing an action
				let betCredits = this.state.betCredits;

				this.setState({
					gameState: undefined,
					betWin: null,
					creditsBalance: this.state.creditsBalance! - betCredits,
					firstBet: false,
					prevHoldBet: !!this.state.holdReels.length,
					reelsSpinning: true,
					reelsStopped: compact(Object.keys(this.resultReels).map((reelID, reelIndex) => {
						// Check if reel is held (if yes return false)
						return this.isReelHeld(reelIndex) && reelID || null;
					}))
				});
			}),

			this.gameClient.selector.game.activity.gameActivityDone$.subscribe(({ gameActivityResults, gameState }) => {
				// Set the state of the game component accordingly
				this.setState({
					gameState,
					gameResults: gameActivityResults,
					prevWinBet: !!gameActivityResults.length,
				});
			}),

			this.gameClient.selector.game.activity.gameActivityFailed$.subscribe(({ gameState }) => {
				// Set the state of the game component accordingly
				this.setState({
					gameState,
					gameResults: [],
					prevWinBet: false,
				});
			}),

			// Subscribe to gameStarted$
			// This will fire when both the game engine and the game interface are started
			// It means that the interface is ready from loading the assets needed and the game engine is ready to accept the first activity
			this.gameClient.selector.game.status.gameStarted$.subscribe(gameStarted => {
				if (gameStarted) {
					this.setState({ gameStarted: gameStarted });
				}
			}),

			// Subscribe to gameReady$
			// This will fire when both the game engine and the game interface are ready
			// It means that the interface is ready from displaying the results of an activity needed and the game engine is ready to accept the next activity
			this.gameClient.selector.game.status.gameReady$.subscribe(gameReady => {
				this.setState({
					gameReady: gameReady
				});
			}),

			this.gameClient.selector.game.global.betCredits$.subscribe(betCredits => {
				this.setState({
					betCredits: betCredits
				});
			})
		);
		// Dispatch start game action
		this.gameClient.dispatcher.slotGame.startGame();
	}

	isReelHeld = (reelIndex: number): boolean => includes(this.state.holdReels, reelIndex + 1);

	getReelIndex = (reelIndex: number) => `reel${reelIndex + 1}`;

	getReelCarousel = (reelIndex: number) => this.resultReels[this.getReelIndex(reelIndex)];

	setReelInstance = (reelIndex: number, instance: Reel) => this.resultReels[this.getReelIndex(reelIndex)] = instance;

	getReelIcons = (reelIndex: number) => ReelIcons[this.getReelIndex(reelIndex)] as string[];

	getVisibleReelIcons = (reelIndex: number, iconIndex: number) => {
		let reelIcons = this.getReelIcons(reelIndex);
		return times(3)
			.map(offset => (iconIndex + offset < reelIcons.length) ? (iconIndex + offset) : (iconIndex + offset - reelIcons.length))
			.map(iconIndex => reelIcons[iconIndex]);
	}

	getBetCredits = (playerChoice: PlayerCoice) => {
		switch (playerChoice) {
			case PlayerCoice.BET_1: return 1;
			case PlayerCoice.BET_5: return 5;
		}
	}

	toggleReelHold = (reelIndex: number) => {
		this.gameClient.dispatcher.slotGame.toggleReelHold({ reelToHold: reelIndex + 1 });
	}

	changeBet = () => {
		// Let the game engine know that the frontend is ready from showing the result
		this.gameClient.dispatcher.slotGame.changeChoice({});
	}

	onChangeBet = (current: number) => {
		this.setState({
			betCredits: current
		});
	}

	onBetClick = () => {
		this.gameClient.dispatcher.slotGame.doSpinReels();
	}

	onSpinResultReady = (reelID: string) => {
		if (this.state.gameState) {
			let reelsStopped = [...this.state.reelsStopped, reelID];
			this.setState({ reelsStopped });
			// Check if all reels stopped
			if (reelsStopped.length === 3) {

				// Update state to show win/loss and updated balance
				this.setState({
					betWin: !!(this.state.gameResults && this.state.gameResults.length),
					holdReels: this.state.gameState.sharedState.mutualState.reels_to_hold || [],
					creditsBalance: this.state.gameState.serverState.balances.credits_meter,
					reelsSpinning: false
				});

				this.gameClient.dispatcher.slotGame.setGameReady();
			}
		}
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
									<Reel
										ref={(reel) => reel && this.setReelInstance(reelIndex, reel)}
										spinning={this.state.reelsSpinning && !this.isReelHeld(reelIndex)}
										items={ReelIcons[this.getReelIndex(reelIndex)]}
										spread={3}
										result={this.state.gameState && this.state.gameState.serverState.protectedState[this.getReelIndex(reelIndex)]}
										itemRender={(item: string, index) => <img key={index} src={`images/symbols/${item.toLowerCase()}.png`}/>}
										onResultReady={() => this.onSpinResultReady(this.getReelIndex(reelIndex))}/>
									<Button disabled={!this.state.gameReady || !this.holdsEnabled} type={this.isReelHeld(reelIndex) ? 'primary' : 'default'} onClick={() => this.toggleReelHold(reelIndex)}>
										{this.isReelHeld(reelIndex) ? 'UNHOLD' : 'HOLD'}
									</Button>
								</Col>)}
							</Row>
						</Col>
					</Row>
					<Row className='meters'>
						<Col span={12}>
							<h4>BET</h4>
							<h3>{this.state.betCredits}</h3>
						</Col>
						<Col span={12}>
							<h4>CREDITS</h4>
							<h3>{this.state.creditsBalance}</h3>
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
				</Col>
			</Row>
		</div>);
	}
}

export default SlotGame;

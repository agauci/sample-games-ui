import * as React from 'react';
import times from 'lodash/times';
import isBoolean from 'lodash/isBoolean';
import includes from 'lodash/includes';
import { NumericDictionary } from 'lodash';
import { Row, Col, Button } from 'antd';
import { ProtectedStatePayload, MutualStatePayload, BalancesPayload, ReelIcons, PlayerCoice, GameRoundResultPayload } from './types/slot-game';
import { SlotGameClient } from './clients/slot-game';
import { BaseGame, BaseGameState } from './base/base-game';
import { Reel } from '../components/game/reel';

export interface SlotGameState extends BaseGameState<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload> {
	reelSpins: number[];
	reelSpinning: number[];
	reelSymbols?: NumericDictionary<string[]>;
	reelHolds: number[];
	reelHoldsEnabled: boolean;
	betCredits: number;
	betWin: boolean | null;
	winMeter?: number;
	creditsMeter?: number;
	gambleEnabled: boolean;
}

export interface ReelDictionary<Type> {
	reel1: Type;
	reel2: Type;
	reel3: Type;
}

export class SlotGame extends BaseGame<MutualStatePayload, ProtectedStatePayload, BalancesPayload, GameRoundResultPayload, {}, SlotGameState> {

	container: HTMLDivElement;
	playerChoices: PlayerCoice[] = [PlayerCoice.BET_1, PlayerCoice.BET_5];

	gameClient = SlotGameClient;

	constructor(props) {
		super(props);

		// Initialize game component state
		this.state = {
			gameStarted: false,
			gameReady: false,
			reelSpins: [],
			reelSpinning: [],
			reelHolds: [],
			reelHoldsEnabled: false,
			betCredits: 0,
			betWin: null,
			gambleEnabled: false
		};
	}

	get resultClass() {
		return isBoolean(this.state.betWin) ? (this.state.betWin ? 'blink-win' : 'blink-loss') : '';
	}

	componentDidMount() {
		this.addSubscriptions(
			// Subscribe to gameStarted selector to check when the game start procedure is ready
			// Make sure that unsubscribe from any subscription when closing a component
			this.gameClient.selector.game.session.gameSessionStarted$.subscribe(({ gameState }) => {
				this.setState({ gameState });
				this.gameClient.dispatcher.slotGame.setGameReady();
			}),

			this.gameClient.selector.game.activity.gameActivityStarted$.subscribe(() => this.setState({ gameState: undefined, betWin: null })),

			this.gameClient.selector.game.activity.gameActivityDone$.subscribe(({ gameActivityResults, gameState }) => {
				this.setState({ gameState, gameResults: gameActivityResults, betWin: !!(gameActivityResults && gameActivityResults.length) });
				this.gameClient.dispatcher.slotGame.setGameReady();
			}),

			this.gameClient.selector.game.activity.gameActivityFailed$.subscribe(({ gameState }) => {
				// Set the state of the game component accordingly
				this.setState({ gameState, gameResults: [] });
				this.gameClient.dispatcher.slotGame.setGameReady();
			}),

			// Subscribe to gameStarted$
			// This will fire when both the game engine and the game interface are started
			// It means that the interface is ready from loading the assets needed and the game engine is ready to accept the first activity
			this.gameClient.selector.game.status.gameStarted$.subscribe(gameStarted => this.setState({ gameStarted: gameStarted })),

			// Subscribe to gameReady$
			// This will fire when both the game engine and the game interface are ready
			// It means that the interface is ready from displaying the results of an activity needed and the game engine is ready to accept the next activity
			this.gameClient.selector.game.status.gameReady$.subscribe(gameReady => this.setState({ gameReady })),

			this.gameClient.selector.game.global.betCredits$.subscribe(betCredits => this.setState({ betCredits	})),

			this.gameClient.selector.slotGame.reels.reelHolds$.subscribe(reelHolds => this.setState({ reelHolds })),

			this.gameClient.selector.slotGame.reels.reelHoldsEnabled$.subscribe(reelHoldsEnabled => this.setState({ reelHoldsEnabled })),

			this.gameClient.selector.slotGame.gamble.gambleEnabled$.subscribe(gambleEnabled => this.setState({ gambleEnabled })),

			this.gameClient.selector.slotGame.reels.reelSymbols$.subscribe(reelSymbols => this.setState({ reelSymbols })),

			this.gameClient.selector.slotGame.reels.reelSpins$.subscribe(reelSpins => this.setState({ reelSpins })),

			this.gameClient.selector.slotGame.meters.creditsMeterStepped$.subscribe(creditsMeter => this.setState({ creditsMeter })),

			this.gameClient.selector.slotGame.meters.winMeterStepped$.subscribe(winMeter => this.setState({ winMeter })),

		);

		const rngBets = ['BET_1', 'BET_5'];
		const rngConfig = {
			keys: {
				'_$REEL_1': 'REEL 1',
				'_$REEL_2': 'REEL 2',
				'_$REEL_3': 'REEL 3'
			},
			configs: [
				...rngBets.map((bet) => ({
					bet: bet,
					spread: 3,
					images: (name) => `images/symbols/${name.toLowerCase()}.png`,
					options: {
						'_$REEL_1': false,
						'_$REEL_2': false,
						'_$REEL_3': false,
					}
				}))
			]
		};

		this.gameClient.dispatcher.game.setRNGConfig({ rngConfig });

		// Dispatch start game action
		this.gameClient.dispatcher.slotGame.startGame();
	}

	isReelHeld = (reelIndex: number): boolean => includes(this.state.reelHolds, reelIndex + 1);

	isReelSpinning = (reelIndex: number): boolean => includes(this.state.reelSpins, reelIndex + 1);

	getReelIndex = (reelIndex: number) => `reel${reelIndex + 1}`;

	getReelIcons = (reelIndex: number) => ReelIcons[this.getReelIndex(reelIndex)] as string[];

	toggleReelHold = (reelIndex: number) => this.gameClient.dispatcher.slotGame.toggleReelHold({ reelToHold: reelIndex + 1 });

	changeBet = () => this.gameClient.dispatcher.slotGame.changeChoice({});

	onBetClick = () => this.gameClient.dispatcher.slotGame.doSpinReels();

	onGambleClick = () => this.gameClient.dispatcher.slotGame.doGambleWin();

	onCollectClick = () => this.gameClient.dispatcher.slotGame.doCollectWin();

	onSpinReady = (reelIndex: number) => {
		if (this.state.gameState && this.state.reelSymbols) {
			this.state.reelSpinning.splice(this.state.reelSpinning.indexOf(reelIndex + 1), 1);
			this.setState({ reelSpinning: [...this.state.reelSpinning] });
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
										spinning={this.isReelSpinning(reelIndex)}
										items={ReelIcons[this.getReelIndex(reelIndex)]}
										spread={3}
										result={this.state.reelSymbols && this.state.reelSymbols[reelIndex + 1]}
										itemRender={(item: string, index) => <img key={index} src={`images/symbols/${item.toLowerCase()}.png`}/>}
										onResultReady={() => this.onSpinReady(reelIndex)}/>
									<Button
										disabled={!this.state.gameReady || !this.state.reelHoldsEnabled}
										type={this.isReelHeld(reelIndex) ? 'primary' : 'default'}
										onClick={() => this.toggleReelHold(reelIndex)}>HOLD</Button>
								</Col>)}
							</Row>
						</Col>
					</Row>
					<Row className='meters'>
						<Col span={8}>
							<h4>BET</h4>
							<h3>{this.state.betCredits}</h3>
						</Col>
						<Col span={8}>
							<h4>WIN</h4>
							<h3>{this.state.winMeter}</h3>
						</Col>
						<Col span={8}>
							<h4>CREDITS</h4>
							<h3>{this.state.creditsMeter}</h3>
						</Col>
					</Row>
					<Row>
						{this.state.gambleEnabled && <Col className='buttons'>
							<Button
								type='primary'
								size='large'
								onClick={() => this.onCollectClick()}
								disabled={!this.state.gameReady}
							>COLLECT</Button>
							<Button
								type='primary'
								size='large'
								onClick={() => this.onGambleClick()}
								loading={!this.state.gameReady}
							>GAMBLE</Button>
						</Col> || <Col className='buttons'>
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
						</Col>}
					</Row>
				</Col>
			</Row>
		</div>);
	}
}

export default SlotGame;

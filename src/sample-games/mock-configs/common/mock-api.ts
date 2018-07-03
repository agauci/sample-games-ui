import { mergeWith, isArray, forOwn } from 'lodash';
import * as mockService from 'osprey-mock-service';
import * as express from 'express';
import * as raml from 'raml-1-parser';
import * as path from 'path';
import * as osprey from 'osprey';
import * as minimist from 'minimist';
import { RAMLtoTypescriptCompiler, PathResolver, PathContentOverride, PathContentOverrideCollection } from '@imagina/raml-to-typescript';
import { RequestHandler } from 'express';
const app = express();

const extendJSONContent = (pathJSON: Object, concatArrays: boolean = false): PathContentOverride => {
	return (pathContent: string) => {
		return JSON.stringify(mergeWith(JSON.parse(pathContent), pathJSON, (objValue, srcValue) => {
			if (isArray(objValue) && concatArrays) {
				return objValue.concat(srcValue);
			}
		}));
	};
};

const pathResolver: PathResolver = (absolutePath: string) => {
	return absolutePath.replace(/(.*resource:)\/?/, path.resolve(process.cwd(), '../game-engine-api/src/main/resources/') + '/').replace(/\\/g, '/');
};

export interface GameMockPayloadConfig<MutualStatePayload, ProtectedStatePayload, BalancesPayload, ResultPayload> {
	protectedState: ProtectedStatePayload,
	mutualState: MutualStatePayload,
	balances: BalancesPayload,
	result: ResultPayload
}

const generateGamePathOverrides = <ProtectedStatePayload, MutualStatePayload, BalancesPayload, ResultPayload>
	(payloads: GameMockPayloadConfig<ProtectedStatePayload, MutualStatePayload, BalancesPayload, ResultPayload>): PathContentOverrideCollection => ({
		'schemas/resources/games/gamecode/getResponseExample.json': extendJSONContent({
			'game': {
				'gameCode': 'CLUB_SPINNER',
				'status': 'OK',
				'categories': [
					'SLOTS'
				],
				'features': [

				],
				'languages': [
					'en_US'
				],
				'tags': [
					'SLOTS'
				],
				'description': 'Club spinner',
				'configs': [
					{
						'key': 'BET_4_PAYTABLE',
						'value': {
							'paytable_combinations': [
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 80.0
									},
									'symbols': [
										'LEMON',
										'LEMON',
										'LEMON'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 200.0,
										'min': 20.0,
										'amount': 0.0
									},
									'symbols': [
										'MYSTERY',
										'MYSTERY',
										'MYSTERY'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'APPLE',
										'APPLE',
										'APPLE'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'CROWN',
										'CROWN',
										'CROWN'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'GRAPES',
										'GRAPES',
										'GRAPES'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'RASPBERRY',
										'RASPBERRY',
										'RASPBERRY'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'PLUM',
										'PLUM',
										'PLUM'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'PEAR',
										'PEAR',
										'PEAR'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 80.0
									},
									'symbols': [
										'ORANGE',
										'ORANGE',
										'ORANGE'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'BAR',
										'BAR',
										'BAR'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 16.0
									},
									'symbols': [
										'CHERRIES',
										'CHERRIES'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 200.0,
										'min': 8.0,
										'amount': 0.0
									},
									'symbols': [
										'MYSTERY',
										'MYSTERY'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 16.0
									},
									'symbols': [
										'LEMON',
										'LEMON'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'WATERMELON',
										'WATERMELON',
										'WATERMELON'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 8.0
									},
									'symbols': [
										'CHERRIES'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 16.0
									},
									'symbols': [
										'ORANGE',
										'ORANGE'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'CHERRIES',
										'CHERRIES',
										'CHERRIES'
									]
								}
							]
						}
					},
					{
						'key': 'BET_1_PAYTABLE',
						'value': {
							'paytable_combinations': [
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 2.0
									},
									'symbols': [
										'CHERRIES'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 8.0
									},
									'symbols': [
										'CHERRIES',
										'CHERRIES',
										'CHERRIES'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 12.0
									},
									'symbols': [
										'WATERMELON',
										'WATERMELON'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'ORANGE',
										'ORANGE'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 200.0
									},
									'symbols': [
										'BAR',
										'BAR',
										'BAR'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'CHERRIES',
										'CHERRIES'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'LEMON',
										'LEMON'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 20.0
									},
									'symbols': [
										'BAR',
										'BAR'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'PEAR',
										'PEAR'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 8.0
									},
									'symbols': [
										'ORANGE',
										'ORANGE',
										'ORANGE'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'RASPBERRY',
										'RASPBERRY'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'WATERMELON',
										'WATERMELON',
										'WATERMELON'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'PLUM',
										'PLUM'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'GRAPES',
										'GRAPES',
										'GRAPES'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 100.0
									},
									'symbols': [
										'CROWN',
										'CROWN',
										'CROWN'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'PLUM',
										'PLUM',
										'PLUM'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 12.0
									},
									'symbols': [
										'CROWN',
										'CROWN'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 200.0,
										'min': 8.0,
										'amount': 0.0
									},
									'symbols': [
										'MYSTERY',
										'MYSTERY',
										'MYSTERY'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 40.0
									},
									'symbols': [
										'PEAR',
										'PEAR',
										'PEAR'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 20.0
									},
									'symbols': [
										'RASPBERRY',
										'RASPBERRY',
										'RASPBERRY'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 8.0
									},
									'symbols': [
										'LEMON',
										'LEMON',
										'LEMON'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 20.0
									},
									'symbols': [
										'APPLE',
										'APPLE',
										'APPLE'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'GRAPES',
										'GRAPES'
									]
								},
								{
									'type': 'CRISS_CROSS',
									'outcome': {
										'max': 200.0,
										'min': 2.0,
										'amount': 0.0
									},
									'symbols': [
										'MYSTERY',
										'MYSTERY'
									]
								},
								{
									'type': 'WINLINE',
									'outcome': {
										'max': 0.0,
										'min': 0.0,
										'amount': 4.0
									},
									'symbols': [
										'APPLE',
										'APPLE'
									]
								}
							]
						}
					},
					{
						'key': 'CREDIT_VALUE',
						'value': {
							'value': 0.1000
						}
					}
				]
			}
		}),
		'schemas/resources/games/gamecode/round/putResponseExample.json': extendJSONContent({
			sharedState: {
				mutualState: payloads.mutualState,
			},
			serverState: {
				protectedState: payloads.protectedState,
				balances: payloads.balances
			}
		}),
		'schemas/resources/games/gamecode/round-sessions/putResponseExample.json': extendJSONContent({
			sharedState: {
				mutualState: payloads.mutualState,
			},
			serverState: {
				protectedState: payloads.protectedState,
				balances: payloads.balances
			}
		}),
		'schemas/resources/games/gamecode/rounds/roundreference/activities/getResponseExample.json': extendJSONContent({
			gameRoundActivities: [
				{
					sharedState: {
						mutualState: payloads.mutualState,
					},
					serverState: {
						protectedState: payloads.protectedState,
						balances: payloads.balances
					}
				}
			]
		}),
		'schemas/resources/games/gamecode/sessions/sessionreference/activities/putResponseExample.json': extendJSONContent({
			gameSessionActivity: {
				sharedState: {
					mutualState: payloads.mutualState,
				},
				serverState: {
					protectedState: payloads.protectedState,
					balances: payloads.balances
				}
			},
			gameRoundResults: [
				{
					payload: payloads.result,
				}
			],
			gameSessionActivityResults: [
				{
					'resultId': '137908050942232065',
					'playerReference': '137905367313286656',
					'type': 'CRISS_CROSS',
					'timestamp': '2018-01-16T13:17:21.56',
					'status': 'COMPLETED',
					'payload': {
						'amount_won': 32,
						'symbol_locations': [
							{
								'reel': 3,
								'location': 3
							},
							{
								'reel': 1,
								'location': 1
							},
							{
								'reel': 2,
								'location': 2
							}
						]
					},
					'creditWon': 32
				},
				{
					'resultId': '137912519062980096',
					'playerReference': '137905367313286656',
					'type': 'WIN',
					'timestamp': '2018-01-16T13:35:06.843',
					'status': 'COMPLETED',
					'payload': {
						'winline': 1,
						'amount_won': 20,
						'symbol_locations': [
							{
								'reel': 3,
								'location': 2
							},
							{
								'reel': 1,
								'location': 2
							},
							{
								'reel': 2,
								'location': 2
							}
						]
					},
					'creditWon': 20
				},
				{
					'resultId': '137913159340262912',
					'playerReference': '137905367313286656',
					'type': 'GAMBLE',
					'timestamp': '2018-01-16T13:37:39.499',
					'status': 'COMPLETED',
					'payload': {
						'is_final': false,
						'amount_won': 24
					},
					'creditWon': 24
				}
			]
		}),
		'schemas/resources/games/gamecode/rounds/roundreference/results/getResponseExample.json': extendJSONContent({
			gameRoundResults: [
				{
					payload: payloads.result,
				}
			]
		})
	});

const args = minimist(process.argv.slice(2));
const gameMockConfig = require(args.config);
const pathOverrides = args.config && generateGamePathOverrides(require(args.config).default);

const compiler = new RAMLtoTypescriptCompiler('../game-engine-api/src/main/resources/raml/v1/game-engine-api-schema.raml', pathResolver, pathOverrides);

compiler.parseRAML()
	.then(() => {
		let raml = compiler.ramlApi.toJSON({ serializeMetadata: false });
		forOwn(compiler.schemaReferences, (schema, reference) => {
			osprey.addJsonSchema(schema, reference);
		});
		app.use(osprey.server(raml, {
			cors: true
		}) as RequestHandler);
		app.use(mockService(raml) as RequestHandler);
		app.listen(3000);
	});

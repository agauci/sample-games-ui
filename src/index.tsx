import { Action, Middleware, Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import { Observable } from 'rxjs/Observable';

import * as Imagina from '../../src/lib';

// Imagina.CounterSelector.count$.subscribe(count => {
// 	console.log('COUNT CHANGE', count);
// });

// Imagina.PostsSelector.posts$.subscribe(posts => {
// 	console.log('POSTS CHANGE', posts);
// });

// Imagina.PostsSelector.post$.subscribe(post => {
// 	console.log('POST CHANGE', post);
// });

// Imagina.CounterClient.startCounting();
// Imagina.CounterClient.setCount(10);

// Imagina.PostsClient.getAllPosts();
// Imagina.PostsClient.getPost({ postId: 1 });

// Imagina.SlotClient.startGame({
// 	gameCode: 'GAME_1',
// 	gameSessionType: 'REAL',
// 	initialSharedState: {
// 		mutualState: {},
// 		currency: 'EUR'
// 	}
// });

// setTimeout(() => {
// 	Imagina.SlotClient.doActivity({
// 		sharedState: {
// 			mutualState: {},
// 			currency: 'EUR'
// 		}
// 	});
// }, 1000);

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './styles.scss';

import DemoRouter from './router';

ReactDOM.render(<DemoRouter />, document.getElementById('demo'));

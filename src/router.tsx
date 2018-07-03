import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router } from 'react-router';
import browserHistory from './history';
import { App } from './app';

export class DemoRouter extends React.Component {

	render() {
		return <Router history={browserHistory}>
			<App />
		</Router>;
	}
}

export default DemoRouter;

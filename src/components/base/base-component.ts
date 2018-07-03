import * as React from 'react';
import { Subscription } from 'rxjs/Subscription';

export abstract class BaseComponent<P = {}, S = {}> extends React.Component<P, S> {

	private subscriptions: Subscription[] = [];

	addSubscriptions(...subscribtions: Subscription[]) {
		this.subscriptions.push(...subscribtions);
	}

	clearSubscriptions() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	componentWillUnmount() {
		this.clearSubscriptions();
	}

}


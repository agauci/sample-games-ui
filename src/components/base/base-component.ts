import * as React from 'react';
import { Subscription } from 'rxjs/Subscription';

export abstract class BaseComponent<P = {}, S = {}> extends React.Component<P, S> {

	private subscriptions: Subscription[] = [];

	private _isMounted: boolean;

	constructor(props) {
		super(props);
		this._isMounted = false;
	}

	protected get isMounted() {
		return this._isMounted;
	}

	componentWillMount() {
		this._isMounted = true;
	}

	addSubscriptions(...subscribtions: Subscription[]) {
		this.subscriptions.push(...subscribtions);
	}

	clearSubscriptions() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	componentWillUnmount() {
		this.clearSubscriptions();
		this._isMounted = false;
	}

}


import * as React from 'react';
import { Carousel } from 'antd';
import { BaseComponent } from '../base/base-component';
import times from 'lodash/times';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';

export interface ReelProps {
	spinning: boolean;
	items: (string | number)[];
	result?: (string | number) | (string | number)[];
	spread?: number;
	hold?: boolean;
	itemRender?: (item: string | number, index: number) => React.ReactNode | string | number;
	onResultReady?: () => void
}

export class Reel extends BaseComponent<ReelProps> {

	reelCarousel: Carousel;
	reelSpinInterval: NodeJS.Timer | null;
	reelSpinCounter: number = 0;

	getVisibleReelItems = (itemIndex: number) => {
		return times(this.props.spread || 1)
			.map(offset => (itemIndex + offset < this.props.items.length) ? (itemIndex + offset) : (itemIndex + offset - this.props.items.length))
			.map(iconIndex => this.props.items[iconIndex]);
	}

	startSpinning = () => {
		if (!this.props.hold) {
			this.reelSpinInterval = setInterval(() => {
				// Check if component still mounted and terminate interval if not to avoid error
				if (!this.isMounted) {
					this.stopSpinning();
					return;
				}

				if (this.props.result) {
					this.setResult();
					this.stopSpinning();
					this.props.onResultReady && this.props.onResultReady();
				} else {
					// Map count to a sequence from 1 to length of reel icons which repeats itself
					let itemIndex = this.reelSpinCounter % this.props.items.length;

					// Change bet indicator to represent current bet (random or not)
					if (this.reelCarousel) {
						this.reelCarousel.goTo(itemIndex);
					}
					this.reelSpinCounter++;
				}

				// // Map count to a sequence from 1 to length of reel icons which repeats itself
				// let itemIndex = this.reelSpinCounter % this.props.items.length;

				// // Change bet indicator to represent current bet (random or not)
				// if (this.reelCarousel) {
				// 	this.reelCarousel.goTo(itemIndex);
				// }

				// // Stop spinning when the serverState is available and when the reel is in the position that matches the result
				// if (isEqual(isArray(this.props.result) && this.props.result || [this.props.result], this.getVisibleReelItems(itemIndex))) {
				// 	this.stopSpinning();
				// 	this.props.onResultReady && this.props.onResultReady();
				// } else {
				// 	this.reelSpinCounter++;
				// }
			}, 150);
		}
	}

	stopSpinning = () => {
		this.reelSpinInterval && clearInterval(this.reelSpinInterval);
		this.reelSpinInterval = null;
	}

	setResult = () => {
		this.props.items.forEach((_item, itemIndex) => {
			if (this.reelCarousel && isEqual(isArray(this.props.result) && this.props.result || [this.props.result], this.getVisibleReelItems(itemIndex))) {
				this.reelCarousel.goTo(itemIndex);
			}
		});
	}

	componentWillReceiveProps(nextProps: ReelProps) {
		if (nextProps.result && !nextProps.spinning) {
			this.setResult();
		}
		if (nextProps.spinning !== this.props.spinning) {
			if (nextProps.spinning) {
				this.startSpinning();
			} else {
				this.stopSpinning();
			}
		}
	}

	render() {
		return <Carousel vertical dots={false} speed={100} ref={(reel) => reel && (this.reelCarousel = reel)}>
			{this.props.items
				.map((_item, index) => <div key={index} className='reel-slide'>
					{this.getVisibleReelItems(index)
						.map((item, index) => this.props.itemRender && this.props.itemRender(item, index) || item)
						.map((item, index) => <div key={index} className='reel-item'>{isObject(item) ? item : <h3>{item}</h3>}</div>)}
			</div>)}
		</Carousel>;
	}
}

export default Reel;

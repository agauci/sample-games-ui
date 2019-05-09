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

	getVisibleReelItems = (itemIndex: number) => {
		return times(this.props.spread || 1)
			.map(offset => (itemIndex + offset < this.props.items.length) ? (itemIndex + offset) : (itemIndex + offset - this.props.items.length))
			.map(iconIndex => this.props.items[iconIndex]);
	}

	setResult = (result: (string | number) | (string | number)[]) => {
		this.props.items.forEach((_item, itemIndex) => {
			if (this.reelCarousel && isEqual(isArray(result) && result || [result], this.getVisibleReelItems(itemIndex))) {
				this.reelCarousel.goTo(itemIndex);
				this.props.onResultReady && this.props.onResultReady();
			}
		});
	}

	componentWillReceiveProps(nextProps: ReelProps) {
		if (nextProps.result && nextProps.result !== this.props.result) {
			this.setResult(nextProps.result);
		}
	}

	render() {
		return <Carousel vertical dots={false} autoplay={false} autoplaySpeed={0} speed={100} ref={(reel) => reel && (this.reelCarousel = reel)} useCSS={true}>
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

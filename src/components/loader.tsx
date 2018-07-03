

import * as React from 'react';
import { Row, Col, Spin } from 'antd';

export class Loader extends React.Component {

	render() {
		return <div>
			<Row>
				<Col className='loader'>
					<Spin/>
				</Col>
			</Row>
		</div>;
	}
}

export default Loader;

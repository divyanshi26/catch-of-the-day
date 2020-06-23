import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers'

class Fish extends React.Component {
	
	render() {
		const key = this.props.index;
		const { details } = this.props;
		const isAvailable = details.status === 'available';
		const buttonText = isAvailable ? "Add To Order" : "Sold Out!";

		return (
			<li className="menu-fish">
				<img src={details.image} alt={details.name} />
				<h3 className="fish-name">
					{details.name}
					<span className="price">{formatPrice(details.price)}</span>
				</h3>
				<p>{details.desc}</p>
				<button onClick={() => this.props.addToOrder(key)} disabled={!isAvailable}>{buttonText}</button>
			</li>
		)
	}

	static propTypes = {
		index: PropTypes.string.isRequired,
		details: PropTypes.object.isRequired,
		addToOrder: PropTypes.func.isRequired
	};
}

export default Fish;
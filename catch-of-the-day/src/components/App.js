import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
	constructor()  {
		super();
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		// initial state / getInitialState()
		this.state = {
			fishes: {},
			order: {},
		};
	}

	componentWillMount() {
		// this runs right before <App> is rendered
		// hooking into firebase
		this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`, {
			context: this,
			state: 'fishes',
		});
		// hooking into localstorage
		// check if there's any order in localstorage
		const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`)
		if(localStorageRef) {
			// update App component
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(
			`order-${this.props.match.params.storeId}`, JSON.stringify(nextState.order)
		);
	}

	addFish(fish) {
		// take copy of state
		// this.state.fishes.fish1 = fish;
		const fishes = {...this.state.fishes};
		// add fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes });
	}

	updateFish(key, updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = {...this.state.fishes}
		fishes[key] = null;
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		// take copy of state
		const order = {...this.state.order};
		// update or add new number of fish ordered
		order[key] = order[key] + 1 || 1;
		// set state
		this.setState({ order });
	}

	removeFromOrder(key) {
		const order = {...this.state.order};
		// order[key] = 0;
		// can use delete since we're not bound by firebase
		delete order[key];
		this.setState({ order });
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh seafood market"/>
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					params={this.props.match.params}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					updateFish={this.updateFish}
					removeFish={this.removeFish}
					loadSamples={this.loadSamples}
					fishes={this.state.fishes}
					storeId={this.props.match.params.storeId}
				/>
			</div>
		)
	}
}

App.propTypes = {
	match: PropTypes.object.isRequired
};

export default App;
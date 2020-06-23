import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

	constructor() {
		super();
		this.goToStore = this.goToStore.bind(this);
	}
	
	goToStore(event) {
		event.preventDefault();  // which is refresing the page with ? / stopping the form from submitting
		const storeId = this.storeInput.value;
		console.log(`You are going to store ${storeId}.`);
		this.props.history.push(`/store/${storeId}`);  // new way to route!
	}

	render() {  // jsx follows. can only return one parent element
		return (
			// <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please enter a store</h2>
				<input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input}} />
				<button type="submit">Visit Store -></button>
			</form>
		)
	}
}



export default StorePicker;

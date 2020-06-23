import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {

	state = {
		uid: null,
		owner: null
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.authHandler({ user });
			}
		});
	}

	handleChange = (e, key) => {
		const fish = this.props.fishes[key];
		// take a copy of that fish and update the copy with new data
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		};
		this.props.updateFish(key, updatedFish);
	};

	authenticate = (provider) => {
		firebase.auth().signInWithPopup(provider).then(this.authHandler);
	};

	logout = () => {
		console.log("logging out...");
		firebase.auth().signOut();
		this.setState({ uid: null });
	};

	authHandler = (authData) => {
		const storeId = this.props.storeId;

		// console.log(authData.user.uid);

		// get store ref
		const storeRef = firebase.database().ref(storeId);

		// query firebase once for store data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			// claim as own if no owner exists
			if(!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
		// console.log(authData);
	};

	renderLogin = () => {
		const googleProvider = new firebase.auth.GoogleAuthProvider();
		const githubProvider = new firebase.auth.GithubAuthProvider();
		return(
			<nav className="login">
				<h2>Inventory</h2>
				<button className="facebook" onClick={() => this.authenticate(googleProvider)}>Log In With Google</button>
				<button className="github" onClick={() => this.authenticate(githubProvider)}>Log In With Github</button>
			</nav>
		)
	};

	renderInventory = (key) => {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => {this.handleChange(e, key)}} />
				<input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => {this.handleChange(e, key)}} />
				<select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => {this.handleChange(e, key)}} >
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => {this.handleChange(e, key)}}></textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => {this.handleChange(e, key)}} />
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	};

	render() {

		const logout = <button onClick={this.logout}>Log Out!</button>

		// check if they are not logged in at all
		if(!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}

		// check of they are the owner of the current store
		if(this.state.uid !== this.state.owner) {
			return(
				<div>
					<p>Sorry you are not the owner of this store!</p>
					{logout}
				</div>
			)
		}

		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
				<AddFishForm addFish={this.props.addFish}/>
				{
					Object
						.keys(this.props.fishes)
						.map(this.renderInventory)
				}
			</div>
		)
	}

	static propTypes = {
		fishes: PropTypes.object.isRequired,
		addFish: PropTypes.func.isRequired,
		updateFish: PropTypes.func.isRequired,
		removeFish: PropTypes.func.isRequired,
		loadSamples: PropTypes.func.isRequired,
		storeId: PropTypes.string.isRequired
	};
}

export default Inventory;
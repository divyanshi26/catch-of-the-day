import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyB3EpHhQ0WZRV2CrLg2bI2ap5qGnXPUXHg",
    authDomain: "divy-catch-of-the-day.firebaseapp.com",
    databaseURL: "https://divy-catch-of-the-day.firebaseio.com"
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };
export default base;
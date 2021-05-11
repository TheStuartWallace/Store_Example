import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

var firebaseConfig = {
	apiKey: "AIzaSyD3EtMzgHnjYat2LbYjYGJi6goQ72UpqLQ",
	authDomain: "storeexample-1c12e.firebaseapp.com",
	databaseURL: "https://storeexample-1c12e.firebaseio.com",
	projectId: "storeexample-1c12e",
	storageBucket: "storeexample-1c12e.appspot.com",
	messagingSenderId: "113670337584",
	appId: "1:113670337584:web:837407a10474f3a3fea9f5"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
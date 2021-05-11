import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import firebase from './Components/Firebase';
import AuthProvider from './Components/Auth'

import ProductList from './Components/ProductList';
import Basket from './Components/Basket';
import CheckoutSuccess from './Components/CheckoutSuccess';
import CheckoutCancel from './Components/CheckoutCancel';
import MainPage from './Components/MainPage';
import SignIn from './Components/SignIn';
import Account from './Components/Account';
import ProductEditor from './Components/ProductEditor';
import Admin from './Components/Admin';
import ViewOrder from './Components/ViewOrder';

class MainApp extends React.Component{
	constructor(props){
		super(props);
		this.dataList = [];
		this.state = {status : 0};
		if(window.localStorage.getItem("basket") === null)		window.localStorage.setItem("basket",JSON.stringify([]));
	}

	componentDidMount(){
		this.setState({status : 0});

		this.loadData().then(data => {
			this.dataList = data;
			this.setState({status : 1});
		});
	}

	async loadData(){
		const data = await firebase.firestore().collection("storeSettings").get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	render(){
		if(this.state.status === 0 || this.context.storeData === null){
			return <div className="Wrapper">Loading data...</div>
		}

		return (
			<AuthProvider>
				<Router>
					<Route path="/" exact component={MainPage} />
					<Route path="/basket" exact component={Basket} />
					<Route path="/success" exact component={CheckoutSuccess} />
					<Route path="/cancel" exact component={CheckoutCancel} />
					<Route path="/products/:id?" exact component={ProductList}/>
					<Route path="/signin" exact component={SignIn}/>
					<Route path="/account" exact component={Account}/>
					<Route path="/editor/:id?" exact component={ProductEditor} />
					<Route path="/admin" exact component={Admin} />
					<Route path="/account/order/:id?" component={ViewOrder} />
				</Router>
			</AuthProvider>
		);
	}
}

ReactDOM.render(<MainApp/>,document.getElementById('root'));
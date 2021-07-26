import React from "react";
import firebase from "Components/Database/Firebase";

export const AuthContext = React.createContext(null);

class AuthProvider extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			currentUser : undefined,
			storeData : undefined,
			orderHistory : undefined,
		};

		this.loadStoreData = this.loadStoreData.bind(this);
		this.loadData = this.loadData.bind(this);
	}

	componentDidMount(){
		firebase.auth().onAuthStateChanged(user =>{
			this.setState({currentUser : user});
			if(user === null) return;

			this.loadData(user.uid).then(userData =>{
				this.setState({userData});
			});

			this.loadOrderHistory(user.uid).then(orderHistory =>{
				this.setState({orderHistory : orderHistory})
			}).catch(console.error);
		});

		this.loadStoreData().then(data =>{
			this.setState({storeData : data});
		});
	}

	async loadData(user){
		const data = await firebase.firestore().collection("userData").doc(user);
		const mainData = await data.get();
		return mainData.data();
	}

	async loadOrderHistory(user){
		const data = await firebase.firestore().collection("adminData").where("uid","==",user).get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	async loadStoreData(){
		const data = await firebase.firestore().collection("storeSettings").get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	async loadProductList(){
		const data = await firebase.firestore.collection("productList").get();
		const mainData = data.get();
		return mainData.data();
	}

	render(){
		return (
			<AuthContext.Provider value={this.state}>
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}

export default AuthProvider;
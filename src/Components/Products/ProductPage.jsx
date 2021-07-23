import React from 'react'
import { Redirect} from "react-router";
import firebase from 'Components/Database/Firebase';
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth';

export default class ProductPage extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);
		this.data = [];
		this.state = {status : 0, redirect : false};
		this.openExpandedImage = this.openExpandedImage.bind(this);
		this.addToBasket = this.addToBasket.bind(this);
	}

	componentDidMount(){
		if(this.props.id)	this.getData();
	}

	getData(){
		this.setState({status:0});

		this.loadData().then(data => {
			this.data = data;
			this.data.id = this.props.id;
			this.data.quantity = 0;
			this.data.displayPrice = this.data.productPrice / 100;
			this.setState({status:1});
		});
	}

	addToBasket(){
		let basket = JSON.parse(window.localStorage.getItem("basket"));
		this.addBasketItem(basket);
		window.localStorage.setItem("basket",JSON.stringify(basket));
		this.setState({redirect : true});
	}

	addBasketItem(basket){
		for(let a=0; a<basket.length; a++){
			if(basket[a] !== undefined){
				if(basket[a].id === this.data.id){
					basket[a].quantity = parseInt(basket[a].quantity) + 1;
					return;
				}
			}
		}

		basket.push(this.data);
		basket[basket.length-1].quantity = parseInt(basket[basket.length-1].quantity) + 1;
		return;
	}

	async loadData(){	
		const data = await firebase.firestore().collection("productList").doc(this.props.id).get();
		return (data.exists ? data.data() : null);
	}

	openExpandedImage(){
		window.open(this.data.image);
	}

	getDescription(){
		let des = this.data.productDescription;

		des = JSON.parse(des);
		des = des.split("\n");

		des = des.map((data)=>{
			if(data === ""){
				return (<span><br/></span>);
			} 
			return (<span>{data}</span>);
		});

		return des;
	}

	render(){
		if(this.state.redirect)	return <Redirect to="/basket" />

		if(this.state.status === 0){
			return (
				<div className="sipWrapper">
					Loading product information
				</div>
			);
		}

		if(this.state.status === 1){
			if(this.data !== null){
				return (
					<div className="sipWrapper">
						<header>
							<NavigationBar/>
						</header>
						
						<main>
							<section pos="left" onClick={()=>{return window.open(this.data.image)}}>
								<img src={this.data.image} />
								Click to expand
							</section>

							<section pos="right">
								<section pos="top">
									<h1>{JSON.parse(this.data.productName)}</h1>
									<h2>£{JSON.parse(this.data.displayPrice)}</h2>
									</section>
								<section pos="middle">
								{
									this.getDescription()
								}
								</section>
							
								<section pos="bottom">
									<button>Buy Now</button>
								</section>
							</section>
						</main>
						
						<footer>

						</footer>
						
					</div>
				);
			}else{
				return (
					<div className="storeItemPage">
						No product found
					</div>
				);
			}
		}
	}
}
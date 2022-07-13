import React from 'react'
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth';
import { loadStripe } from '@stripe/stripe-js';
	
const stripePromise = loadStripe('pk_test_51HHEl2HbWsI0wL0616xJL9FkVOSuvpDFAfYvYfwwmOv044YOH4npf2jEko9ISFcouW3Y5ETqkQMWxeizaDANXNTL0018qa39p8');

export default class Basket extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);
		this.state = {checkoutText : "Proceed to Checkout", storedItems : JSON.parse(window.localStorage.getItem("basket")),};
	}

	componentDidMount(){
		this.calculateTotal();
	}

	calculateTotal(){
		let total = 0;

		for(let a=0; a<this.state.storedItems.length; a++){
			total = total + (this.state.storedItems[a].productPrice * this.state.storedItems[a].quantity);
			total = total + (this.state.storedItems[a].deliveryPrice * this.state.storedItems[a].quantity);
		}

		this.setState({grandTotal:total});
	}

	removeItem(e){
		if(window.confirm("This will remove all of this item from your basket, are you sure?")){
			let data = this.state.storedItems;

			for(let a=0; a<data.length; a++){
				if(data[a].id === e.target.id)	data.splice(a,1);
			}

			this.setState({storedItems : data}, () => {window.localStorage.setItem("basket",JSON.stringify(this.state.storedItems))});
			this.calculateTotal();
		}
	}

	changeBasketItemQuantity(e){
		e.target.value = e.target.value.replace("."	,"");
		e.target.value = e.target.value.replace(",","");
		e.target.value = e.target.value.replace(" ","");


		let oldData = this.state.storedItems;

		for(let a=0; a<oldData.length; a++){
			if(oldData[a].id === e.target.id){
				oldData[a].quantity = e.target.value;
				break;
			}
		}
		this.setState({storedItems : oldData},() => {window.localStorage.setItem("basket",JSON.stringify(this.state.storedItems))});
		this.calculateTotal();
	}

	getBasketData(){
		let uploadData = [];

		for(let key=0; key<this.state.storedItems.length; key++){
			uploadData.push({
				"key":this.state.storedItems[key].id,
				"quantity" : this.state.storedItems[key].quantity,
			});
		}

		return JSON.stringify(uploadData);
	}

	parseData(){
		let uploadData = [];

		for(let key=0; key<this.state.storedItems.length; key++){
			uploadData.push({
				"name" : JSON.parse(this.state.storedItems[key].productName),
				"quantity" : this.state.storedItems[key].quantity,
				"price" : this.state.storedItems[key].productPrice,
			});
		}

		return JSON.stringify(uploadData);
	}

	async handleClick(event){
		this.setState({checkoutText : "Please Wait..."});
		const stripe = await stripePromise;
		const response = await fetch('https://www.bystuart.co.uk/store-example/checkout-session', { method: 'POST', body:JSON.stringify({
			uid : btoa(this.context.currentUser.uid),
			data : btoa(this.parseData()),
			throughdata : btoa(this.getBasketData()),
		})});

		const session = await response.json();
		console.log(session.id);
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			this.setState({checkoutText : "Error: "+result.error.message});
			console.error(response.text());
		}
	}

	render(){
		return (
			<div className="basketWrapper">
				<NavigationBar/>
				<div className="basketContainer">
					<header>
						My Basket
					</header>

					<main>
						{
							this.state.storedItems.map((item,index) => (
								<div key={index}>
									<section type="image"><img alt="Store Item" src={item.image}/></section>

									<section type="name">{JSON.parse(item.productName)}</section>

									<section type="price">
										<h1>£{((item.productPrice * item.quantity)/100).toFixed(2)}</h1>
										<h2>£{((item.deliveryPrice * item.quantity)/100).toFixed(2)}</h2>
									</section>

									<section type="quantity">
										<input 	type="number"
												id={item.id}
												min="1" max="99" 
												defaultValue={item.quantity} 
												onChange={e => this.changeBasketItemQuantity(e)}
										/>
									</section>

									<section type="remove">
										<input 	type="submit"
												id={item.id}
												value="&#10007;"
												onClick={e => this.removeItem(e)}
										/>
									</section>
								</div>
							))
						}
					</main>

					<footer>
						Your total comes to £{(this.state.grandTotal/100).toFixed(2)}
						
						<button role="link" onClick={(e)=>this.handleClick(e)}>
							{this.state.checkoutText}
						</button>
					</footer>
				</div>
			</div>
		);
	}
}
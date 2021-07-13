import React from 'react'
import {Redirect} from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import NavigationBar from './NavigationBar';
import {AuthContext} from './Auth';
import FirebaseAction from './FirebaseAction';

class Basket extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);
		this.state = {storedItems : JSON.parse(window.localStorage.getItem("basket")),};
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

	onToken(token){
		this.token = token;
		console.log(token);
		FirebaseAction.addOrderHistory(this.context.currentUser.uid,this.state.storedItems,this.state.grandTotal,this.token);
		window.localStorage.setItem("basket","[]");
		this.setState({redirect : true, storedItems : []},()=>{this.calculateTotal();});
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

	

	render(){
		if(this.state.redirect){
			return <Redirect to={{pathname: "/success",state : {token : this.token}}}/>
		}

		return (
			<div className="basketWrapper">
				<NavigationBar/>
				<div className="basketContainer">
					<div className="basketTopBar">
						My Basket
					</div>

					<div className="basketList">
						{
							this.state.storedItems.map((item,index) => (
								<div className="basketListItem" key={index}>
									<div className="basketListItemImageCont"><img className="basketListItemImage" alt="Store Item" src={item.image}/></div>
									<div className="basketListItemName">{JSON.parse(item.productName)}</div>
									<div className="basketListItemPrice">
										<div className="basketListItemPriceMain">
											£{((item.productPrice * item.quantity)/100).toFixed(2)}
										</div>
										
										<div className="basketListItemPriceDelivery">
											£{((item.deliveryPrice * item.quantity)/100).toFixed(2)}
										</div>
										
									</div>
									<div className="basketListItemQuantity">
										<input 	type="number"
												className="basketListItemQuantityInput" 
												id={item.id}
												min="1" max="99" 
												defaultValue={item.quantity} 
												onChange={e => this.changeBasketItemQuantity(e)}
										/>
									</div>

									<div className="basketListItemRemove">
										<input 	type="submit"
												id={item.id}
												className="basketListItemQuantityRemove"
												value="&#10007;"
												onClick={e => this.removeItem(e)}
										/>
									</div>
								</div>
							))
						}
					</div>

					<div className="basketBottomBar">
						Your total comes to £{(this.state.grandTotal/100).toFixed(2)}
						
						<StripeCheckout
							name="Store Example Co."
							amount={this.state.grandTotal}
							token={token => this.onToken(token)}
							currency="GBP"
							email={(this.context.currentUser !== undefined ? this.context.currentUser.email : "")}
							shippingAddress={true}
							stripeKey="pk_test_51HHEl2HbWsI0wL0616xJL9FkVOSuvpDFAfYvYfwwmOv044YOH4npf2jEko9ISFcouW3Y5ETqkQMWxeizaDANXNTL0018qa39p8"
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Basket
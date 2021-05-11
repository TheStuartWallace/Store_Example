 import React from 'react';

import {Link, Redirect} from 'react-router-dom';

class StoreListItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {redirect : null};
		this.props.data.quantity = 0;
		this.props.data.displayPrice = (this.props.data.productPrice) / 100;
	}

	addToBasket(){
		let basket = JSON.parse(window.localStorage.getItem("basket"));
		this.addBasketItem(basket);
		window.localStorage.setItem("basket",JSON.stringify(basket));
		this.setState({redirect : true})
	}

	addBasketItem(basket){

		for(let a=0; a<basket.length; a++){
			if(basket[a] !== undefined){
				if(basket[a].id === this.props.data.id){
					console.log(parseInt(basket[a].quantity) + 1);
					basket[a].quantity = parseInt(basket[a].quantity) + 1;
					return;
				}
			}
		}
		basket.push(this.props.data);
		basket[basket.length-1].quantity = 1;
		return;
	}

	render(){
		if(this.state.redirect)		return <Redirect to="/basket"/>
		
		return (
			<div className="sliWrapper">
				<Link to={`/products/${this.props.data.id}`} className="sli">
						<img className="sliImage" src={this.props.data.image} alt={this.props.data.productName}/>
						<div className="sliTitle">{JSON.parse(this.props.data.productName)}</div>
						<div className="sliPrice">£{this.props.data.displayPrice}</div>
						<button className="sliBuy" onClick={()=>this.addToBasket()}>Buy Now</button>
				</Link>
			</div>
		);
	}
}

export default StoreListItem;
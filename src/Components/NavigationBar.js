import React from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from './Auth';

class NavigationBar extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			status : -1,
			basketAmount : this.getTotal(),
		}
	}

	getTotal(){
		let basket = JSON.parse(window.localStorage.getItem("basket")), total = 0;

		for(let x=0; x<basket.length; x++)	total += parseInt(basket[x].quantity);
		return total;
	}

	componentDidMount(){this.waitForContext();	}
	componentDidUpdate(prevProps, prevState, snapshot){		this.waitForContext();	}
	waitForContext(){if(this.context && this.context.storeData && this.state.status === -1)	this.setState({status : 0});}


	render(){
		if(this.state.status === -1){
			return <div className="navWrapper">Loading...</div>
		}
		return (
			<div className="navWrapper">
				<Link className="navLink" to="/">
					<button className="navButtonHome">
						<span className="navLinkButtonText">Home</span>
						<img 	className="navLinkButtonImage" 
								alt="Home Navigation Button"
								src="https://firebasestorage.googleapis.com/v0/b/storeexample-1c12e.appspot.com/o/HomeAlt.svg?alt=media&token=d71028d0-a3a6-491f-8690-7193f5289cb5"
						/>
					</button>
				</Link>
				
				<Link className="navLink" to="/products/">
					<button className="navButtonCatagories">
						<span className="navLinkButtonText">Products</span>
						<img 	className="navLinkButtonImage" 
								alt="Product Navigation Button"
								src="https://firebasestorage.googleapis.com/v0/b/storeexample-1c12e.appspot.com/o/ProductsAlt.svg?alt=media&token=686777dc-56a5-4e92-9f13-25121f7b5030"
						/>
					</button>
				</Link>
				<span className="navTitle">{this.context.storeData[1].StoreTitle}</span>
				{
					(this.context.userData === undefined || this.context.userData === null )? 
						<Link className="navLink" to="/signin">
							<button className="navButtonBasket">
								<span className="navLinkButtonText">Sign in</span>
								<img 	className="navLinkButtonImage" 
									alt="Sign In Navigation Button"
									src="https://firebasestorage.googleapis.com/v0/b/storeexample-1c12e.appspot.com/o/AccountAlt.svg?alt=media&token=37d726f9-dbf1-40a7-a342-aa6a3262ab61"
							/>
							</button>
						</Link>
						:
						<Link className="navLink" to="/account">
							<button className="navButtonBasket">
								<span className="navLinkButtonText">{this.context.userData.displayName}'s account</span>
								<img 	className="navLinkButtonImage" 
										alt="Account Navigation Button"
										src="https://firebasestorage.googleapis.com/v0/b/storeexample-1c12e.appspot.com/o/AccountAlt.svg?alt=media&token=37d726f9-dbf1-40a7-a342-aa6a3262ab61"
							/>
							</button>
						</Link>
						
				}
				<Link className="navLink" to="/basket">
					<button className="navButtonBasket">
						<span className="navLinkButtonText">Basket ({this.state.basketAmount})</span>
						<img 	className="navLinkButtonImage" 	
								alt="Basket Navigation Button"
								src="https://firebasestorage.googleapis.com/v0/b/storeexample-1c12e.appspot.com/o/BasketAlt.svg?alt=media&token=9c8a999c-0278-4419-b5ea-111a69866065"
						/>
					</button>
				</Link>
			</div>
		);	
	}
}

export default NavigationBar;
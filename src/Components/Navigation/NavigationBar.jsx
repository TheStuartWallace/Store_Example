import React from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from 'Components/Auth/Auth';

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
	waitForContext(){if(this.context && this.context.storeData &&	 this.state.status === -1)	this.setState({status : 0});}


	render(){
		if(this.state.status === -1){
			return <div className="navWrapper">Loading...</div>
		}
		return (
			<nav className="navWrapper">
				<Link to="/"><header>{this.context.storeData[1].StoreTitle}</header></Link>
				<section></section>
				<footer><input type="text" placeholder="Search..." /><button><span class="material-symbols-outlined">search</span></button></footer>
			</nav>
		);	
	}
}

export default NavigationBar;
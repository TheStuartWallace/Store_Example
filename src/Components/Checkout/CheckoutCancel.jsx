import React from 'react'
import {Redirect} from "react-router";
import {Link} from 'react-router-dom';
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth'

class CheckoutCancel extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			redirect : false,
		};
	}

	render(){
		if(this.state.redirect){
			return <Redirect to="/"/>
		}
		
		return (
			<Link to="/">
				<div className="CheckoutSuccessWrapper">
				<NavigationBar/>
					<div className="CheckoutSuccess">
						Unfortunately an error has occured or the action was cancelled.<br/>
						<br/>
						Click anywhere to return home.
					</div>
				</div>
			</Link>
		);
	}
}

export default CheckoutCancel;
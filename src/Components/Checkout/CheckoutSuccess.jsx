import React from 'react'
import {Redirect} from "react-router";
import {Link} from 'react-router-dom';

import FirebaseAction from 'Components/Database/FirebaseAction';
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth'

class CheckoutSuccess extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			redirect : false,
			data : JSON.parse(atob(this.props.location.search.split("=")[1])),
		};

		FirebaseAction.setAdminData(this.state.data);

		window.localStorage.setItem("basket",JSON.stringify([]));
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
						Hello, {this.state.data.email}!<br/>
						<br/>
						Since this is an example store, no actual payment was taken.<br/>
						<br/>
						Click anywhere to return home.
					</div>
				</div>
			</Link>
		);
	}
}

export default CheckoutSuccess;
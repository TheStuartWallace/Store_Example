import React from 'react';
import firebase from 'Components/Database/Firebase'
import NavigationBar from 'Components/Navigation/NavigationBar';
import {Redirect} from 'react-router-dom';

class SignIn extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			redirect : null
		};
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	async handleSignIn(event){
		event.preventDefault();
		const {email,password} = event.target.elements; 
		try{
			await firebase.auth().signInWithEmailAndPassword(email.value,password.value);
			this.setState({redirect : true})
		}catch(error){
			alert(error);
		}
	}

	render(){
		if(this.state.redirect !== null) return <Redirect to="/"/>
		return (
			<div className="SignInWrapper">
				<NavigationBar />
				<form onSubmit={this.handleSignIn}>
					<label>Email<br/><input type="email" name="email" placeholder="example@example.com"/></label><br/>
					<br/>
					<label>Password<br/><input type="password" name="password" placeholder="password"/></label><br/>
					<br/>
					<button type="submit">Sign in</button>
				</form>
			</div>
		);
	}
}

export default SignIn;
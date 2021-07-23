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
			<div className="PageWrapper">
				<NavigationBar />
				<form onSubmit={this.handleSignIn}  className="SignInWrapper">
					<div>
						<h1>Email</h1>
						<input type="email" name="email" placeholder="example@example.com"/>
					</div>

					<div>
						<h1>Password</h1>
						<input type="password" name="password" placeholder="password"/>
					</div>
					<div>
						<button type="submit">Sign in</button>
					</div>
				</form>
			</div>
		);
	}
}

export default SignIn;
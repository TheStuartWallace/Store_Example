import React from 'react';
import FirebaseAction from 'Components/Database/FirebaseAction'
import NavigationBar from 'Components/Navigation/NavigationBar';
import {Redirect} from 'react-router-dom';

class SignUp extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			redirect : null
		};
	}

	handleSignUp(event){
		event.preventDefault();
		const {display,email,password} = event.target.elements;

		FirebaseAction.createUser(display.value,email.value,password.value).then((data)=>{
			this.setState({redirect : "/"});
		}).catch((error)=>{this.setState({error : error})});
	}

	render(){
		if(this.state.redirect !== null) return <Redirect to="/"/>
		return (
			<div className="PageWrapper">
				<NavigationBar />
				<form onSubmit={(e)=>{this.handleSignUp(e)}}  className="SignInWrapper">
					<div>
						<h1>Display Name</h1>
						<input type="text" name="display" placeholder="Jane Doe" required/>
					</div>

					<div>
						<h1>Email</h1>
						<input type="email" name="email" placeholder="example@example.com" required/>
					</div>

					<div>
						<h1>Password</h1>
						<input type="password" name="password" placeholder="password" required/>
					</div>

					<div flag="error" style={{"display":(this.state.error ? "initial" : "none")}}>
						<h3>Error: {this.state.error?.message}</h3	>
					</div>
					<div>
						<button type="submit">Create Account</button>
					</div>
				</form>
			</div>
		);
	}
}

export default SignUp;
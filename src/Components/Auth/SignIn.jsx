import React from 'react';
import FirebaseAction from 'Components/Database/FirebaseAction'
import NavigationBar from 'Components/Navigation/NavigationBar';
import {Redirect, Link} from 'react-router-dom';

class SignIn extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			redirect : null
		};
	}

	handleSignIn(event){
		event.preventDefault();
		const {email,password} = event.target.elements; 
		
		FirebaseAction.signIn(email.value,password.value).then(data=>{
			if(data.message){
				this.setState({error : data});
			}else{
				this.setState({redirect : true});
			}
		}).catch((error)=>{this.setState({error : error})});
		
	}

	render(){
		if(this.state.redirect !== null) return <Redirect to={this.state.redirect}/>
		return (
			<div className="PageWrapper">
				<NavigationBar />
				<form onSubmit={(e)=>this.handleSignIn(e)}  className="SignInWrapper">
					<div>
						<h1>Email</h1>
						<input type="email" name="email" placeholder="example@example.com"/>
					</div>

					<div>
						<h1>Password</h1>
						<input type="password" name="password" placeholder="password"/>
					</div>

					<div flag="error" style={{"display":(this.state.error ? "initial" : "none")}}>
						{	this.state.error?.code === "auth/user-not-found" ? 
								<h3><Link to="/signup">
									No Account found, Sign up instead?
								</Link></h3>
								: 
								<h3>Error: {this.state.error?.message}</h3> 
						}
					</div>

					<div>
						<button type="submit">Sign in</button>
						<h4 onClick={()=>{this.setState({redirect : "/signup"})}}>Create Account</h4>
					</div>
				</form>
			</div>
		);
	}
}

export default SignIn;
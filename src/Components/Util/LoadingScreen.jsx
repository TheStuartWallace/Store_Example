import React from 'react';

class LoadingScreen extends React.Component{

	render(){
		return (
			<div className="LoadingScreenWrapper">
				<span className="LoadingScreenMessage">Loading...</span>
			</div>
		);
	}
}

export default LoadingScreen;
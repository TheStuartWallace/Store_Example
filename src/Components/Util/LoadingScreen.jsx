import React from 'react';
import 'Style/LoadingScreen.css';

class LoadingScreen extends React.Component{

	render(){
		return (
			<div className="LoadingScreenWrapper">
				<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
			</div>
		);
	}
}

export default LoadingScreen;
import React from 'react';
import LoadingScreen from './LoadingScreen';
import {AuthContext} from './Auth';

class Catagory extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			status : 0,
		};
	}

	componentDidUpdate(){
		if(this.context !== undefined && this.context.storeData !== undefined && this.state.status === 0){

			let keys = Object.keys(this.context.storeData[0]);
			let vals = Object.values(this.context.storeData[0]);

			let idkey= keys.indexOf("id");
			keys.splice(idkey,1);
			vals.splice(idkey,1);

			this.setState({
				listKeys : keys,
				listValue : vals,
				status : 1
			});
		}
	}
	

	render(){
		switch(this.state.status){
			case -1: default: return (<div className="catWrapper">Error</div>);

			case 0: return (<LoadingScreen/>);

			case 1: return (
				<div className="catWrapper">
					<div className="catList" >
						{
							Object.keys(this.state.listKeys).map((data,index) => {

								return (
									<div key={index} className="catListTag">
										<input 	type="checkbox" 
												id={this.state.listKeys[index]} 
												name="Catagorys"
												className="catCheck" 
												onChange={(e) => this.props.handleSearch(e)}/>

										<label 	className="catLabel" htmlFor={this.state.listKeys[index]}>{this.state.listKeys[index]}</label>
									</div>
								);
							})
						}
					</div>
				</div>
				)
		}
	}
}

export default Catagory;
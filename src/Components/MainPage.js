import React from 'react';
import {Link} from 'react-router-dom';
import NavigationBar from './NavigationBar';
import LoadingScreen from './LoadingScreen';
import {AuthContext} from './Auth';


class MainPage extends React.Component{
	
	static contextType = AuthContext;
	
	constructor(props){
		super(props);
		
		this.state = {
			status : -1,
		};
	}

	componentDidUpdate(){
		if(this.context !== undefined && this.context.storeData !== undefined && this.state.status === -1)		this.setState({status : 0});
	}

	componentDidMount(){
		if(this.context !== undefined && this.context.storeData !== undefined && this.state.status === -1)		this.setState({status : 0});
	}

	render(){
		switch(this.state.status){
			case -1: default: return <LoadingScreen />
		 
			case 0: return (
				<div className="PageWrapper">
					<NavigationBar />
					<div className="MainPageColumnWrapper">
						<Link to={this.context.storeData[1].ColumnLinkLeft} className="MainPageColumnLeft">
							<div className="MainPageColumn" style={{background:this.context.storeData[1].ColumnBackgroundLeft}}>
								<img className="MainPageColumnImage" src={this.context.storeData[1].ColumnImageLeft} alt={this.context.storeData[1].ColumnAltLeft}/>
							</div>
						</Link>

						<Link to={this.context.storeData[1].ColumnLinkCenter} className="MainPageColumnCenter">
							<div className="MainPageColumn" style={{background:this.context.storeData[1].ColumnBackgroundCenter}}>
								<img className="MainPageColumnImage" src={this.context.storeData[1].ColumnImageCenter} alt={this.context.storeData[1].ColumnAltCenter}/>
							</div>
						</Link>

						<Link to={this.context.storeData[1].ColumnLinkRight} className="MainPageColumnRight">
							<div className="MainPageColumn" style={{background:this.context.storeData[1].ColumnBackgroundRight}}>
								<img className="MainPageColumnImage" src={this.context.storeData[1].ColumnImageRight} alt={this.context.storeData[1].ColumnAltRight}/>
							</div>
						</Link>
					</div>
				</div>
			);
		}
	}
}

export default MainPage;
import React from 'react';
import {Link} from 'react-router-dom';
import NavigationBar from 'Components/Navigation/NavigationBar';
import LoadingScreen from 'Components/Util/LoadingScreen';
import {AuthContext} from 'Components/Auth/Auth';


class MainPage extends React.Component{
	static contextType = AuthContext;
	
	constructor(props){
		super(props);

		this.state = {status : -1};
	}

	componentDidMount(){this.waitForContext();	}
	componentDidUpdate(prevProps, prevState, snapshot){		this.waitForContext();	}
	waitForContext(){if(this.context && this.context.storeData && this.state.status === -1)	this.setState({status : 0});}

	render(){
		switch(this.state.status){
			case -1: default: return <LoadingScreen />
		 
			case 0: return (
				<div className="MainPage">
					<NavigationBar />
					<header></header>
					<main>
						<section style={{background:this.context.storeData[1].ColumnBackgroundLeft}} pos="left">
							<Link to={this.context.storeData[1].ColumnLinkLeft}>
								<img src={this.context.storeData[1].ColumnImageLeft} alt={this.context.storeData[1].ColumnAltLeft}/>
							</Link>
						</section>

						<section  style={{background:this.context.storeData[1].ColumnBackgroundCenter}} pos="middle">
							<Link to={this.context.storeData[1].ColumnLinkCenter}>
								<img src={this.context.storeData[1].ColumnImageCenter} alt={this.context.storeData[1].ColumnAltCenter}/>
							</Link>
						</section>

						<section style={{background:this.context.storeData[1].ColumnBackgroundRight}} pos="right">
							<Link to={this.context.storeData[1].ColumnLinkRight}>
								<img src={this.context.storeData[1].ColumnImageRight} alt={this.context.storeData[1].ColumnAltRight}/>
							</Link>
						</section>
					</main>
				</div>
			);
		}
	}
}

export default MainPage;
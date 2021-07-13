import React from 'react';

class PageNavigation extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			currentPage : 0,
			maxPages : this.props.maxPages,
		};
	}

	prevPage(){
		if(this.state.currentPage - 1 >= 0){
			this.setState({currentPage : this.state.currentPage - 1},
			() => {this.props.onPageChange(this.state.currentPage)});
		}
	}

	nextPage(){
		if(this.state.currentPage + 1 < this.state.maxPages){
			this.setState(
				{currentPage : this.state.currentPage + 1},
				()=>{this.props.onPageChange(this.state.currentPage)}
			);
		}
	}

	render(){
		let returnValue = [];

		returnValue.push(<div key="leftCap" onClick={()=>this.prevPage()} className="GlobalNavBallLeftCap"></div>);
		

		for(let a=0; a<this.state.maxPages; a++){
			returnValue.push(
				<div 	onClick={()=>this.setState({currentPage : a},() => {this.props.onPageChange(this.state.currentPage)})}
						key={a} 
						className={(a === this.state.currentPage ? "GlobalNavBallFilled" : "GlobalNavBall")}>
				</div>);
		}
		

		returnValue.push(<div key="rightCap" onClick={() => this.nextPage()} className="GlobalNavBallRightCap"></div>);
		
		return (<div className="GlobalPageNavigation">{returnValue}</div>);
	}
}

export default PageNavigation;
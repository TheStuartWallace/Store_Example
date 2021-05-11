import React from 'react';
import {Link} from 'react-router-dom';
import firebase from './Firebase';

class TitleBar extends React.Component{
	constructor(props){
		super(props);

		this.state = {status:0};
		this.dataList = [];
	}

	componentDidMount(){
		this.setState({status : 0});

		this.loadData().then(data => {
			this.dataList = data;
			this.setState({status : 1});
		});
	}

	async loadData(){
		const data = await firebase.firestore().collection("storeSettings").get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	render(){
		if(this.state.status === 0) return (<div className="MainPageTitleBar">{""}</div>);

		return (
			<Link to="/"><div className="MainPageTitleBar">{this.dataList[1].StoreTitle}</div></Link>
		);
	}
}

export default TitleBar;
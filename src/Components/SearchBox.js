import React from 'react';

import StoreListItem from './StoreListItem';
import NavigationBar from './NavigationBar';
import Catagory from './Catagory';
import {AuthContext} from './Auth';
import FirebaseAction from './FirebaseAction';

class SearchBox extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);
		this.state = {status : 0};
		this.serverData = [];
		this.dataList = [];

		this.searchInput = React.createRef();
	}

	componentDidUpdate(){
		this.runCheck();
	}

	componentDidMount(){
		this.runCheck();
	}

	runCheck(){
		if(this.context !== undefined && this.context.storeData !== undefined && this.state.status === 0){
			FirebaseAction.getProductList().then(data => {
				this.serverData = data; 
				this.dataList = data;
			
				let catagoryData = {};
				let catKey;

				for(catKey in this.context.storeData[0]){
					catagoryData = {
						...catagoryData,
						[catKey] : false,
					};
				}

				this.setState({dataList : catagoryData, status : 1});
			});
		}
	}

	search(element){
		this.setState({status : 0});
		const searchterm = element.target.value.toLowerCase();

		if(!this.state.catagorys){
			this.dataList = this.serverData.filter(function(data){
				return data.productName.toLowerCase().includes(searchterm);
			});
		}else{
			this.searchCatagory();
			this.dataList = this.dataList.filter(function(data){
				return data.productName.toLowerCase().includes(searchterm);
			});
		}
		
		this.setState({status : 1});
	}

	searchCatagory(){
		this.setState({status : 0});

		let a = this;

		let trueVals = Object.keys(this.state.dataList).filter(function(num){
			return a.state.dataList[num];
		});

		if(trueVals.length === 0){
			this.dataList = this.serverData;
			this.setState({status : 1, catagorys : false});
			return;
		}

		this.dataList = this.serverData.filter(function(data){
			let prodCat = JSON.parse(data.Catagory).split("+");
			return prodCat.some(r=>trueVals.includes(r));
		});
		
		this.setState({status : 1, catagorys : true});
	}

	handleCatagoryList(data){
		this.setState({
			dataList : {
				...this.state.dataList,
				[data.target.id] : data.target.checked,
			}
		},()=>this.searchCatagory());
	}
	

	render(){
		return (
			<div className="schWrapper">
				<NavigationBar/>
					<div className="schContainer">
						<div className="schLeft">
							<Catagory handleSearch={(e) => this.handleCatagoryList(e)}/>
						</div>

						<div className="schRight">
							<input type="text" className="schInput" placeholder="Search..." onChange={(e)=>this.search(e)}/><br/>
							
							<div className="schResult">
							{
								this.dataList.map((data,index) => (
									<StoreListItem key={index} data={data} />
								))
							}
							</div>
						</div>
					</div>
			</div>
		);
	}
}

export default SearchBox;
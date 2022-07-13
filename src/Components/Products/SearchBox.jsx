import React from 'react';

import NavigationBar from 'Components/Navigation/NavigationBar';
import Catagory from 'Components/Products/Catagory';
import {AuthContext} from 'Components/Auth/Auth';
import FirebaseAction from 'Components/Database/FirebaseAction';
import {Link} from 'react-router-dom';


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

	addToBasket(data){
		let basket = JSON.parse(window.localStorage.getItem("basket"));
		this.addBasketItem(basket,data);
		window.localStorage.setItem("basket",JSON.stringify(basket));
	}

	addBasketItem(basket,data){

		for(let a=0; a<basket.length; a++){
			if(basket[a] !== undefined){
				if(basket[a].id === this.props.data.id){
					basket[a].quantity = parseInt(basket[a].quantity) + 1;
					return;
				}
			}
		}
		basket.push(data);
		basket[basket.length-1].quantity = 1;
		return;
	}
	

	render(){
		return (
			<div className="schWrapper">
				<NavigationBar/>
					<div className="schContainer">
						<section type="left">
							<Catagory handleSearch={(e) => this.handleCatagoryList(e)}/>
						</section>

						<section type="right">
							<input type="text" placeholder="Search..." onChange={(e)=>this.search(e)}/><br/>
							
							<div>
							{
								this.dataList.map((data,index) => {
									return (
										<div className="sliWrapper">
											<Link to={`/products/${data.id}`}>
												<img src={data.image} alt={data.productName}/>
												<h1>{JSON.parse(data.productName)}</h1>
												<h2>£{data.displayPrice}</h2>
												<button onClick={()=>this.addToBasket(data)}>Buy Now</button>
											</Link>
										</div>
									);
								})
							}
							</div>
						</section>
					</div>
			</div>
		);
	}
}

export default SearchBox;
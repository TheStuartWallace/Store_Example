import React from 'react';

import {AuthContext} from './Auth';
import FirebaseAction from './FirebaseAction';
import {Link} from 'react-router-dom';
import NavigationBar from './NavigationBar';
import LoadingScreen from './LoadingScreen';
import PageNavigation from './PageNavigation';

class Account extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			status : 0,
			showPage : 0,

			maxPages : 2,

			resetSent : false,
			orderHistory : undefined,
			orderStatus : ["Placed","Dispatched","Out for delivery","Complete","Returned"],
		};

	}

	componentDidUpdate(){
		if(this.context.currentUser !== undefined && this.context.storeData !== undefined && this.context.orderHistory !== undefined && this.context.userData !== undefined && this.state.orderHistory === undefined){
			this.setState({orderHistory : []},()=>this.processOrderHistory());
		}
	}

	componentDidMount(){
		if(this.context.currentUser !== undefined && this.context.storeData !== undefined && this.context.orderHistory !== undefined && this.context.userData !== undefined && this.state.orderHistory === undefined){
			this.setState({orderHistory : []},()=>this.processOrderHistory());
		}
	}

	async resetPassword(){
		FirebaseAction.resetPassword(this.context.currentUser.email)
		this.setState({resetSent : true});
	}

	async processOrderHistory(){
		for(let order=0; order<this.context.orderHistory.length; order++){			
			let currentOrder = [];

			let currentOrderData = this.context.orderHistory[order];
			
			for(let item=0; item<currentOrderData.data.length; item++){
				let info = JSON.parse(currentOrderData.data[item]);

				await FirebaseAction.getProductInfo(info.key).then((data) => {
					currentOrder.push({
						...data,
						productName : JSON.parse(data.productName),
						sku : JSON.parse(data.sku),
						productDescription : JSON.parse(data.productDescription),
						Catagory : JSON.parse(data.Catagory),
						quantity : info.quantity,
					});
				});
			}

			let array = this.state.orderHistory;
			array.push(currentOrder);
			this.setState({orderHistory : array});
		}
		this.setState({status : 1});
	}

	renderPanel(){
		switch(this.state.showPage){
			case 0: default: 
				return (
					<div className="accPanel">
						<div className="accPanelTitle">Display Settings</div>
						<div className="accPanelItem">
							<label htmlFor="accDisplayName">Display Name</label><br/>
							<input 	id="accDisplayName" 
									className="accPanelInput" 
									type="text" 
									name="displayName" 
									defaultValue={this.context.userData.displayName}/>
						</div>
	
						<div className="accPanelItem">
							<label htmlFor="accEmail">Email</label><br/>
							<input 	id="accEmail"
									className="accPanelInput" 
									type="text" 
									name="displayName" 
									defaultValue={this.context.currentUser.email}/>
						</div>
	
						<div className="accPanelItem">
							<label htmlFor="accResetPassword">Password</label><br/>
							<button id="accResetPassword"
									className="accPanelButton" 
									disabled={this.state.resetSent} 
									onClick={() => this.resetPassword()}>Change Password</button>
						</div>
					</div>
				);

		case 1:
			return (
				<div className="accPanel" style={{"justify-content":"initial"}}>
					<div className="accPanelTitle">Order History</div><br/>
					{
						this.context.orderHistory.map((data,index) => {
							return (
								<Link className="accPanelItem" to={"/account/order/"+data.id}>
									<div className="accPanelItem" key={index}>
										<div class="GlobalSpacer"></div>
										<span className="accOHItemPlaced">Placed: {data.created.toDate().toDateString()}</span><br/>
										{
											this.state.orderHistory[index].map((item,index2) => {
												return (
													<div className="accOHItemInfo" key={index2}>
														Item #{index2+1} - {item.productName}({item.quantity})
													</div>
												);
											})
										}
										<span className="accOHItemStatus">Status: {this.state.orderStatus[data.status]}</span><br/>
										<span className="accOHItemTotal">Paid: £{data.paid/100}</span> 
									</div>
								</Link>
							);
						})
					}
				</div>
			);
		}
	}

	render(){
		switch(this.state.status){
			case -1: default: return <span>Error!</span>;

		case 0: return <LoadingScreen />

		case 1: 
			return (
				<div className="accWrapper">
					<NavigationBar />
					{this.renderPanel()}
					<PageNavigation maxPages={this.state.maxPages} onPageChange={(e)=>this.setState({showPage : e})} />
				</div>
			);
		}
	}
}

export default Account;
import React from 'react';

import FirebaseAction from 'Components/Database/FirebaseAction';
import LoadingScreen from 'Components/Util/LoadingScreen';
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth';

class ViewOrder extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.statusTitles = [
			"Placed",
			"Dispatched",
			"Out for delivery",
			"Complete",
			"Returned"
		];

		this.statusDescriptions = [
			"Placed, in the system ready to be dispatched",
			"Dispatched, ready to be sent out for delivery",
			"Out for delivery, with our postal carrier",
			"Completed, order has been recieved",
			"Refunded, Sorry if there was a problem with your order"
		];

		this.state = {
			status : 0,
			id : this.props.match.params.id,
			productInfo : {},
		};
	}

	componentDidUpdate(){
		if(this.context !== undefined && this.context.storeData !== undefined && this.state.status === 0){
			FirebaseAction.getUserOrder(this.state.id).then((data) => {
				
				if(data === undefined){
					this.setState({status : -1});
				}else{
					let dateString = "";
					let date = data.created.toDate();

					const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

					dateString = month[date.getMonth()]+" "+date.getDate();

					if(date.getDate().toString().endsWith("1")){
						dateString = dateString+"st ";
					}else if(date.getDate().toString().endsWith("2")){
						dateString = dateString+"nd ";
					}else if(date.getDate().toString().endsWith("3")){
						dateString = dateString+"rd ";
					}else{
						dateString = dateString+"th ";
					}

					dateString = dateString + date.getFullYear();

					this.setState({orderData : {...data,dateString : dateString}});

					for(let a=0; a<data.data.length; a++){
						let itemData = JSON.parse(data.data[a]);

						FirebaseAction.getProductInfo(itemData.key).then((info) => {
							let productInfo = JSON.parse(JSON.stringify(this.state.productInfo));
							productInfo = {
								...productInfo,
								[itemData.key] : {
									...info,
									productName : JSON.parse(info.productName),
									Catagory : JSON.parse(info.Catagory),
									productDescription : JSON.parse(info.productDescription),
									sku : JSON.parse(info.sku),

								}
							};
							this.setState({productInfo : productInfo},()=>{
								if(a === data.data.length-1){
									this.setState({status : 1});
								}
							});
						});
					}
				}
			});
		}
	}

	render(){
		switch(this.state.status){

			case -1: default: return (
				<div className="vopWrapper">
					<NavigationBar/>
					<div className="vopPanelError">Error loading order information</div>
				</div>
			);

			case 0: return (
				<div className="vopWrapper">
					<NavigationBar/>
					<LoadingScreen />
				</div>
			);

			case 1: return (
				<div className="vopWrapper">
					<NavigationBar/>
					<div className="vopPanelTitle">About your order placed <span>{this.state.orderData.dateString}</span></div>

					<div className="vopPanelStatus">
						<span className="vopPanelStatusBig">Your order is {this.statusTitles[this.state.orderData.status]}</span><br/>
						<span className="vopPanelStatusSmall">{this.statusDescriptions[this.state.orderData.status]}</span>
					</div>

					<div className="vopPanelShipping">
						<span className="vopPanelInnerTitle">Shipping Address</span>
						<br/>
						<span>{this.state.orderData.address.name}</span><br/>
						<span>{this.state.orderData.address.line1}</span><br/>
						{this.state.orderData.address.line2 !== null ? (<span>{this.state.orderData.address.line2}</span>) : <span></span>}<br/>
						<span>{this.state.orderData.address.city}</span><br/>
						<span>{this.state.orderData.address.postcode	}</span><br/>
					</div>

					<div className="vopPanelItems"> 
						<span className="vopPanelInnerTitle">Order Items</span>
						{
							this.state.orderData.data.map((data,index) => {
								let item = JSON.parse(data);

								return (
									<div key={index} className="vopPanelOrderItem">
										<span className="vopPanelOrderItemTitle">(x{item.quantity}) {this.state.productInfo[item.key].productName}</span>
										<span className="vopPanelOrderItemPrice">£{this.state.productInfo[item.key].displayPrice} + (£{(this.state.productInfo[item.key].deliveryPrice/100).toFixed(2)} P&P)</span>
									</div>
								)
							})
						}
					</div>	

					<div className="vopPanelTotal">
						Order Total: £{(this.state.orderData.paid/100).toFixed(2)}
					</div>
				</div>
			);

		}
	}
}

export default ViewOrder;
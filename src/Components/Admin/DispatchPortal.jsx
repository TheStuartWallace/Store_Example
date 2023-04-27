import React from 'react';
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth';
import FirebaseAction from 'Components/Database/FirebaseAction';
import LoadingScreen from 'Components/Util/LoadingScreen';
import PageNavigation from 'Components/Navigation/PageNavigation';

export default class DispatchPortal extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);
		
		this.state = {
			status : -1,
						orderStatus : ["Placed","Dispatched","Out for delivery","Complete","Returned"],

		};
	}

	checkStatus(){
		if(	this.context !== undefined && 
			this.context.currentUser !== undefined && 
			this.context !== null && 
			this.context.currentUser !== null && 
			this.context.storeData !== undefined && 
			this.context.storeData[0] !== undefined && 
			this.context.storeData[1] !== undefined && 
			this.state.status === -1){
			
			if(this.state.orderData === undefined) return true;
		}

		return false;
	}

	componentDidUpdate(){
		if(this.checkStatus()) this.getInfo();
	}

	componentDidMount(){
		if(this.checkStatus()) this.getInfo();
	}

	async getInfo(){
		if(!this.checkStatus()) return;

		this.setState({orderData : [], status : 0});
			
			await FirebaseAction.getAdminData().then((data) => {
				this.setState({openOrders : data},()=>{

					this.state.openOrders.map(async (odat,index)=>{
						let oldState = this.state.orderData;
						oldState.push([]);

						this.setState({orderData : oldState},()=>{
							odat.data.map(async(order)=>{
								let key = JSON.parse(order).key;

								await FirebaseAction.getProductInfo(key).then((retData)=>{
									let oldArray = this.state.orderData;
									oldArray[index].push(retData);
									this.setState({orderData : oldArray});
								});
							})
						});
							
					});	
				});
			});

		this.setState({columnSettings : this.context.storeData[1], status : 1});
	}

	renderOrder(index,data){
		return (
			<div key={index} className="dspOrder">
				<div className="admOITitle">Order #{index+1}</div>
				<div className="admOIBio">
					<div className="admOIBioTitle">Recipient Information</div>
					<div className="admOIName">Name: {data.name}</div>
					<div className="admOIEmail"><a href={"mailto:"+data.email}>Email: {data.email}</a></div>
				</div>

				<div className="admOIAddress">
					<div className="admOIAddressTitle">Shipping Address</div>
					<span className="admOIAddressLine">{data.address.line1}</span><br/>
					{data.address.line2 !== null && <span className="admOIAddressLine">{data.address.line2}</span>}
					<span className="admOIAddressLine">{data.address.city}</span><br/>
					<span className="admOIAddressLine">{data.address.postcode}</span><br/>
				</div>

				<div className="admOIItems">
					{
						this.state.orderData[index].map((dat2)=>{
							return (
								<div className="AdmOIItems">
									{JSON.parse(dat2.productName)}
								</div>
							);
						})
					}
				</div>

				<div className="admOIStatus"> 
					<span className="admOIStatusText">Status: {this.state.orderStatus[data.status]}</span>
					<br/>
					<button className="admOIAdvanceOrder" disabled={data.status >= 3} onClick={() => this.advanceFullfillment(index)}>
						{data.status >= 3 && <b>Completed Order</b>}
						{data.status < 3 && <b>Advance to {this.state.orderStatus[data.status+1]}</b>}
					</button><br/>
									
					<button className="admOIRefund" onClick={()=>this.makeRefund(data.id, data.pid)}>Issue Refund</button>
				</div>
			</div>
		);
	}



	render(){
		if(this.state.status !== 1){
			return <LoadingScreen />
		}
		return (
			<div className="dispatchWrapper">
				<NavigationBar />

				<div>
					<section type="openOrders">
						<h1>Open Orders</h1>

						<section>
							{
								this.state.openOrders.map((data,index) => {
									return this.renderOrder(index,data);
								})
							}
						</section>

					</section>
				</div>
			</div>
		);
	}
}
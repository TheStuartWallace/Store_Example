import React from 'react';
import NavigationBar from './NavigationBar';
import {AuthContext} from './Auth';
import FirebaseAction from './FirebaseAction';
import LoadingScreen from './LoadingScreen';
import PageNavigation from './PageNavigation';

class Admin extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			orderStatus : ["Placed","Dispatched","Out for delivery","Complete","Returned"],
			status : -1,

			showPage : 0,
			maxPages : 2
		};
	}

	componentDidUpdate(){
		if(	this.context !== undefined && 
			this.context.currentUser !== undefined && 
			this.context !== null && 
			this.context.currentUser !== null && 
			this.context.storeData !== undefined && 
			this.context.storeData[0] !== undefined && 
			this.context.storeData[1] !== undefined && 
			this.state.status === -1){
			if(this.state.orderData === undefined) this.getInfo();
		}
	}

	componentDidMount(){
		if(	this.context !== undefined && 
			this.context.currentUser !== undefined && 
			this.context !== null && 
			this.context.currentUser !== null && 
			this.context.storeData !== undefined && 
			this.context.storeData[0] !== undefined && 
			this.context.storeData[1] !== undefined && 
			this.state.status === -1){
			if(this.state.orderData === undefined) this.getInfo();
		}
	}

	async getInfo(){
		if(	this.context !== undefined && this.context.currentUser !== undefined && this.context !== null && this.context.currentUser !== null && this.context.storeData !== undefined && this.context.storeData[0] !== undefined && this.context.storeData[1] !== undefined && this.state.status === -1){
			if(this.state.orderData !== undefined) return; 
		}

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
	
	advanceFullfillment(index){
		let order = this.state.openOrders[index];
		if(order.status < 3){
			FirebaseAction.advanceOrder(order).then(() => {
				this.setState({status : -1});
			});
		}
	}

	handleSettingsChange(e){
		this.setState({
			columnSettings : {
				...this.state.columnSettings,
				[e.target.name] : e.target.value.replace(/\n/g, '')
			}
		})
	}

	saveSettings(){
		FirebaseAction.saveSettings(this.state.columnSettings);
	}

	async makeRefund(id, pid){
		const response = await fetch('http://localhost:4242/make-refund', { method: 'POST', body: btoa(pid) });
		const data = await response.json();

		if(data.status === "failed"){
			alert("Unable to refund, "+data.reason);
			return;
		}else{
			FirebaseAction.setOrderRefunded(id).then(()=>{
				this.setState({status : -1});
			});
		}
	}

	renderColumnSettings(name){
		return (
			<div className={"admColumnSettings"+name}>
				<span className="admColumnSettingsTitle">{name} Column Settings</span><br/>
								
				<div className="admColumnSettingImage">
					<label htmlFor={"ColumnImage"+name}>Image Link for {name} Column</label>
					<textarea 	type="text" 
								className="admColumnSettingsInputLink"
								name={"ColumnImage"+name}
								id={"ColumnImage"+name} 
								onChange={(e) => this.handleSettingsChange(e)}
								value={this.state.columnSettings["ColumnImage"+name]} /><br/>
				</div>

				<div className="admColumnSettingAlt">
					<label htmlFor={"ColumnAlt"+name}>Alt text for {name} Column</label>
					<input 	type="text" 
							className="admColumnSettingsInput"
							name={"ColumnAlt"+name}
							id={"ColumnAlt"+name} 
							onChange={(e) => this.handleSettingsChange(e)}
							value={this.state.columnSettings["ColumnAlt"+name]} /><br/>
				</div>

				<div className="admColumnSettingLink">
					<label htmlFor={"ColumnLink"+name}>Link for {name} Column</label>
					<input 	type="text" 
							className="admColumnSettingsInput"
							name={"ColumnLink"+name}
							id={"ColumnLink"+name} 
							onChange={(e) => this.handleSettingsChange(e)}
							value={this.state.columnSettings["ColumnLink"+name]} /><br/>
				</div>

				<div className="admColumnSettingColor">
					<label htmlFor={"ColumnBackground"+name}>Background Color for {name} Column</label>
					<input 	type="color" 
							className="admColumnSettingsInput"
							name={"ColumnBackground"+name}
							id={"ColumnBackground"+name}
							onChange={(e) => this.handleSettingsChange(e)}
							value={this.state.columnSettings["ColumnBackground"+name]} /><br/>
				</div>
			</div>
		);
	}

	renderPanel(){
		switch(this.state.showPage){

			default: return (<LoadingScreen/>);

			case 0: 
				if(this.state.openOrders.length === 0){
					return (<div className="admPanel">No current open orders.</div>);
				}
			return (
				<div className="admPanel">
					{
						this.state.openOrders.map((data,index) => {
							return (
								<div key={index} className="admOI">
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
						})
					}
				</div>);

			case 1: return (
				<div className="admPanel">
					<div className="admPanelColumnSettings">
						<div>
						
						<label htmlFor="StoreTitle">Store Title</label><br/>
						<input type="text" 
									name="StoreTitle"
									id="StoreTitle"
									onChange={(e)=>this.handleSettingsChange(e)}
									value={this.state.columnSettings.StoreTitle}
						/>
						</div>

						<div className="admColumnSettingsWrapper">
							{this.renderColumnSettings("Left")}
							{this.renderColumnSettings("Center")}
							{this.renderColumnSettings("Right")}
						</div>
						<button onClick={()=>this.saveSettings()}>Save Changes</button>
					</div>
				</div>);
		}
	}

	render(){
		switch(this.state.status){
			case -1: case 0: default: return (<LoadingScreen />);

			case 1: return (
					<div className="admWrapper">
						<NavigationBar/>

						{this.renderPanel()}

						<PageNavigation maxPages={this.state.maxPages} onPageChange={(e)=>this.setState({showPage : e})} />
					</div>
			);
		}
	}
}

export default Admin;
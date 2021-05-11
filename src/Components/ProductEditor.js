import React from 'react';
import NavigationBar from './NavigationBar';
import {AuthContext} from './Auth';
import firebase from './Firebase';
import {Link, Redirect} from 'react-router-dom';
import FirebaseAction from './FirebaseAction';
import ContentEditable from 'react-contenteditable'


class ProductEditor extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);
		this.data = [];
		this.state = {status : 0, redirect : false, changedData : {}};
		this.changedData = {};
	}

	componentDidMount(){
		this.getData();
	}

	getData(){
		this.setState({status:0});
		if(!this.props.match.params.id){
			FirebaseAction.getProductList().then(data => {
				this.data = data;
				this.setState({status:1});
			});
		}else{
			FirebaseAction.getProductInfo(this.props.match.params.id).then(data => {
				this.data = data;
				this.data.id = this.props.match.params.id;
				
				if(isNaN(this.data.productPrice)){
					console.error("data.productPrice was NaN, reset to 0");
					this.data.productPrice = 0;
				}

				this.data.displayPrice = parseInt(this.data.productPrice) / 100;
				
				this.setState({changedData : this.data});
				this.setState({status:1});
		
			});
		}
	}

	saveChanges(){
		this.savedData = this.state.changedData;
		this.savedData.productPrice = parseInt(JSON.parse(this.savedData.productPrice));
		this.savedData.deliveryPrice = parseInt(JSON.parse(this.savedData.deliveryPrice));
		FirebaseAction.setProductInfo(this.props.match.params.id,this.savedData);
	}

	handleChange(element,name){
		let data;

		if(name === "productDescription"){
			data = element.target.value;
			data = data.replaceAll("<div>","");
			data = data.replaceAll("</div>","");
			data = data.replaceAll("<br>","\n");
		}else{
			data = element.target.value;
		}

		this.setState({
			changedData : {
				...this.state.changedData,
				[name] : JSON.stringify(data),
			}
		});
	}

	uploadFile(event){

		let dat = FirebaseAction.setProductImage(this.props.match.params.id,event);
		dat.then(snapshot => snapshot.ref.getDownloadURL())
			.then((url) => {
				this.setState({
					changedData : {
						...this.state.changedData,
						image:url,
					}
				})
				this.data.image = this.state.changedData.image;
				this.saveChanges();
		}).catch(console.error);		
	}

	renderItem(){
		if(this.state.status === 1){
			if(this.data !== null){
					return (
					<div className="storeItemPageWrapper">
						<NavigationBar/>
						<div className="sipWrapper">
							<div className="sipLeft">
								<ContentEditable 
									html={JSON.parse(this.state.changedData.productName)} 
									onChange={(e) => this.handleChange(e,"productName")}
									className="sipName"/><br/>
								
								<img 	onClick={()=>window.open(this.state.changedData.image,'popup','scrollbars=no')} 	
										className="sipImage" 
										src={this.state.changedData.image} 
										alt={`${this.state.changedData.productName}`} />

								<input 
									type="file"
									onChange={(e)=>this.uploadFile(e)}
								/>
								
							</div>

							<div className="sipRight">
								<div className="sipInfo">
									<ContentEditable 
										className="pedDesc" 
										onChange={(e)=>this.handleChange(e,"productDescription")}
										html={JSON.parse(this.state.changedData.productDescription).replaceAll("\n","<br>")}/>

									<div className="sipBuyBox">
										<div className="sipBoxPrice">
											<span className="sipPrice">
												£<ContentEditable 
													html={""+JSON.parse(this.state.changedData.productPrice)} 
													onChange={(e) => this.handleChange(e,"productPrice")}
													tagName="span"/>
											</span><br/>
											<span className="sipItemPP">
												(£
													<ContentEditable 
													html={""+JSON.parse(this.state.changedData.deliveryPrice)} 
													onChange={(e) => this.handleChange(e,"deliveryPrice")}
													tagName="span"/>
												P&P)</span>
										</div>
									</div>

									<div className="sipBuyWrapper">
										<button className="sipBuyButton" onClick={()=>this.saveChanges()}>Save Changes</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			}else{
				return (
					<div className="productEditorPage">
						No product found
					</div>
				);
			}
		}
	}

	async addNewProduct(){
		const blankData = {
			productName : "\"\"",
			productDescription : "\"\"",
			Catagory : "\"\"",
			deliveryPrice : 0,
			productPrice : 0,
			sku : "\"\"",
			image : "\"\"",
			unitPerDeliveryCharge : 0,
		};

		const data = await firebase.firestore().collection("productList").add(blankData);
		return <Redirect to={`/editor/${data.id}`} />
	}

	renderSelector(){
		return (
			<div className="productEditorPage">
			<NavigationBar/>
				<div className="productEditorPageWrapper">
					<span className="productEditorListTitle">Edit specific product</span>
					
					{
						this.data.map((data,index) => (
								<div key={index} className="productEditorListContainer">
									<Link key={index} to={`/editor/${data.id}`}>
										<span className="productEditorListName">{data.productName}</span><br/>
										<span className="productEditorListID">[{data.id}]</span>
									</Link>
								</div>
						))
					}
					<br/>
					<button className="productEditorListAddButton" onClick={() => this.addNewProduct()}>Add new item</button>
				</div>
			</div>
		);
	}

	render(){
		if(this.state.status === 0){
			return (
				<div className="productEditorPage">
					Loading product information
				</div>
			);
		}

		if(!this.props.match.params.id){
			return this.renderSelector();
		}else{
			return this.renderItem();
		}
	}
}

export default ProductEditor;
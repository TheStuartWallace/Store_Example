import React from 'react';
import NavigationBar from 'Components/Navigation/NavigationBar';
import {AuthContext} from 'Components/Auth/Auth';
import firebase from 'Components/Database/Firebase';
import {Link, Redirect} from 'react-router-dom';
import FirebaseAction from 'Components/Database/FirebaseAction';
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

			data = data.replaceAll("</span><span><br></span>","\n\n");
			data = data.replaceAll("<span>","");
			data = data.replaceAll("</span>","\n");
			data = data.replaceAll("&nbsp;"," ");

			if(data.endsWith("\n")){
				data = data.slice(0,-1);				
			}

		}else if(name === "productPrice"){
			data = element.target.value.substr(1);
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

	getDescription(){
		let des = this.state.changedData.productDescription;

		des = JSON.parse(des);
		des = des.split("\n");
		des = des.map((data)=>{if(data === ""){return "<span><br></span>";} return "<span>"+data+"</span>";});
		des = des.toString().replaceAll(">,<","><");

		return des;
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
					<div className="sipWrapper">
						<header>
							<NavigationBar/>
						</header>
						
						<main>
							<section pos="left">
								<img src={this.data.image} />
								<input type="file" onChange={(e)=>this.uploadFile(e)}/>
							</section>

							<section pos="right">
								<section pos="top">
									<ContentEditable
										html={JSON.parse(this.state.changedData.productName)}
										onChange={(e)=>{this.handleChange(e,"productName")}}
										tagName="h1"
									/>

									<ContentEditable
										html={"£"+JSON.parse(this.state.changedData.productPrice)}
										onChange={(e)=>{this.handleChange(e,"productPrice")}}
										tagName="h2"
									/>
								</section>
								<ContentEditable 
										pos="middle"
										html={this.getDescription()}
										onChange={(e)=>{this.handleChange(e,"productDescription")}}
										tagName="section"/>
							
								<section pos="bottom">
									<button onClick={()=>this.saveChanges()}>Save Changes</button>
								</section>
							</section>
						</main>
						
						<footer>

						</footer>
						
					</div>
				);
			}else{
				return (
					<div className="storeItemPage">
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
		this.setState({redirect : '/editor/'+data.id});
	}

	removeItem(id){
		if(window.confirm("This action cannot be undone, are you sure?")){
			FirebaseAction.removeProduct(id);
		}
	}

	renderSelector(){
		return (
			<div className="productEditorPage">
			<NavigationBar/>
				<div className="productEditorPageWrapper">
					<header>Edit specific product</header>
					
					<main>
					{
						this.data.map((data,index) => {
							return (	
								<div key={index} className="productEditorListContainer">
									<section pos="left">
										<img src={data.image} />
									</section>
									
									<section pos="middle">
										<h1>{JSON.parse(data.productName)}</h1>
									</section>
									
									<section pos="right">
										<button onClick={()=>{this.setState({redirect : "/editor/"+data.id})}}>Edit</button>
										<button onClick={()=>{this.removeItem(data.id)}}>Remove</button>
									</section>	
								</div>
							);
						})
					}
					</main>
					<footer>
						<button className="productEditorListAddButton" onClick={() => this.addNewProduct()}>Add new item</button>
					</footer>
				</div>
			</div>
		);
	}

	render(){
		if(this.state.redirect){
			return <Redirect to={this.state.redirect} />
		}

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
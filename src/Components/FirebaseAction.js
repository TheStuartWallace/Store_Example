import firebase from './Firebase';

class FirebaseAction{

	static async getProductInfo(id){	
		const data = await firebase.firestore().collection("productList").doc(id).get();
		return (data.exists ? data.data() : null);
	}

	static async setProductInfo(id,info){
		firebase.firestore().collection("productList").doc(id).update(info);
	}

	static async getProductList(){
		const data = await firebase.firestore().collection("productList").get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	static async getUserData(user){
		const data = await firebase.firestore().collection("userData").doc(user);
		const mainData = await data.get();
		return mainData.data();
	}

	static async getUserOrderHistory(user){
		const data = await firebase.firestore().collection("adminData").where("uid","==",user).get();
		return data.docs.map(doc => doc.data());
	}

	static async getUserOrder(order){
		const data = await firebase.firestore().collection("adminData").doc(order).get();
		return data.data();
	}

	static async getStoreSettings(){
		const data = await firebase.firestore().collection("storeSettings").get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	static async addOrderHistory(uid,orderData,gt,token){
		let uploadData = [];

		for(let key=0; key<orderData.length; key++){
			uploadData.push(JSON.stringify({
				"key":orderData[key].id,
				"quantity" : orderData[key].quantity,
			}));
		}

		const adminData = {
			name : token.card.name,
			
			email : token.email,

			address : {
				name : token.card.name,
				line1 : token.card.address_line1,
				line2 : token.card.address_line2,
				city : token.card.address_city,
				postcode : token.card.address_zip,
			},

			data : uploadData,
			created : firebase.firestore.FieldValue.serverTimestamp(),

			status : 0,

			uid : uid,
			token : token.id,

			paid : gt,

		};

		firebase.firestore().collection("adminData").doc(token.id).set(adminData).catch((error) => {
			window.alert("There was an issue placing this order, please contact support");
			console.error("Unable to write to admin panel! ("+error+")");
		});
	}

	static async setOrderRefunded(id){
		await firebase.firestore().collection("adminData").doc(id).update({status : 4});
	}

	static async getAdminData(){
		const adminData = await firebase.firestore().collection("adminData").where("status","<",3).get().catch((error) => {alert(error); console.log(error)});
		const mainData = adminData.docs.map(doc => doc.data());
		const idData = adminData.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		mainData.sort((a,b) => (a.created > b.created) ? 1 : ((b.created > a.created) ? -1 : 0));
		return mainData;
	}

	static async setProductImage(id,event){
		const ref = firebase.storage().ref();
		const file = event.target.files[0];
		const meta = {contentType : file.type};
		const name = id;

		const task = ref.child(name).put(file,meta);
		
		return await task;
	}

	static async advanceOrder(order){
		firebase.firestore().collection("adminData").doc(order.id).update({
			status : (order.status + 1)
		}).catch((error) => {
			console.error(error);
		});	
	}

	static async saveSettings(e){
		firebase.firestore().collection("storeSettings").doc("StoreSettings").update(e)
		.catch((error) => {
			console.error(error);
		});
	}

	static async resetPassword(e){
		await firebase.auth().sendPasswordResetEmail(e);
	}
}

export default FirebaseAction;
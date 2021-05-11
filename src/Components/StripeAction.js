import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51HHEl2HbWsI0wL0616xJL9FkVOSuvpDFAfYvYfwwmOv044YOH4npf2jEko9ISFcouW3Y5ETqkQMWxeizaDANXNTL0018qa39p8');

class StripeAction{
	static async createProduct(data){
		const stripe = await stripePromise;
		console.log(stripe);
		let product = await stripe.products.create(data);
		return product.json();
	} 

	static async updateProduct(id,data){

	}

	static async setupCheckout(data){

	}
}

export default StripeAction;
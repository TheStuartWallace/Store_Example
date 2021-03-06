import React from 'react';

import SearchBox from 'Components/Products/SearchBox';
import ProductPage from 'Components/Products/ProductPage';

export default class ProductList extends React.Component{
	render(){
		if(!this.props.match.params.id){
			return <SearchBox />
		}else{
			return <ProductPage id={this.props.match.params.id}/>
		}
	}
}
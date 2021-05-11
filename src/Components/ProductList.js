import React from 'react';

import SearchBox from './SearchBox';
import StoreItemPage from './StoreItemPage';

class ProductList extends React.Component{
	render(){
		if(!this.props.match.params.id){
			return <SearchBox />
		}else{
			return <StoreItemPage id={this.props.match.params.id}/>
		}
	}
}

export default ProductList;
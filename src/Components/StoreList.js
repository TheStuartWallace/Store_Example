import React from 'react';

import StoreListItem from './StoreListItem';

class StoreList extends React.Component{
	render(){
		
		if(this.props.data.length === 0){
			return (
				<div className="storeListItemNull">
					<span>No results</span>
				</div>
			);
		}

		return (
			<div className="storeList">
				{
					this.props.data.map((data,index) => (
						<StoreListItem key={index} data={data} />
					))
				}
			</div>
		);
	}
}

export default StoreList;
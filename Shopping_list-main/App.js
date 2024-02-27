import React, { useState, useEffect } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const App = () => {
	// HINT: each "item" in our list names a name,
	// a boolean to tell if its been completed, and a quantity
	const [items, setItems] = useState([
		
	]);

	const [inputValue, setInputValue] = useState('');
	const [totalItemCount, setTotalItemCount] = useState(0);

	const handleAddButtonClick = () => {
		const newItem = {
			itemName: inputValue,
			quantity: 1,
			isSelected: false,
		};
		calculateTotal();
		const newItems = [...items, newItem];
		for (let i = 0; i < items.length; i++){
			if(newItem.itemName == items[i].itemName){
			alert('Wrong! It already appear')
			newItems.pop();
		}
		}
		
		setInputValue('');
		// setItems(newItems);
	};

	const handleQuantityIncrease = (index) => {
		const newItems = [...items];

		newItems[index].quantity++;
		calculateTotal();
		setItems(newItems);
		
	};

	const handleQuantityDecrease = (index) => {
		const newItems = [...items];

		newItems[index].quantity--;
		if(newItems[index].quantity < 0 ){
			newItems[index].quantity = 0;
		}
		calculateTotal();
		setItems(newItems);
		
	};
	useEffect(()=>{
		calculateTotal()},
		[items])
	useEffect(()=>{
		const getItemsList = async () => {
		  try{
			const res = await axios.get('http://localhost:8000/api/items')
			setItems(res.data.map((todo) => {
                return {
                    itemName: todo.item,
                    quantity: 1,
                    ...res.data
                }
			
            }))
			
			console.log(items[1]);
		  }catch(err){
			console.log(err);
		  }
		}
		getItemsList();
	  },[]);
	// Add todo
	const addItem = async (e) => {
		e.preventDefault();
		try{
		  const res = await axios.post('http://localhost:8000/api/items',{item: inputValue, quantity: 1})
		  
		  
		  if(res.data.item) {
			setItems(prev => [...prev,{itemName: res.data.item, quantity:1, ...res.data}]);
			setInputValue('');
		  }
		  
		  console.log(res.data.item);
		}catch(err){
		  console.log(err);
		}
	  }
	const toggleComplete = (index) => {
		
		const newItems = [...items];

		newItems[index].isSelected =! newItems[index].isSelected;
		calculateTotal();
		setItems(newItems);
	};

	const calculateTotal = () => {
		const totalItemCount = items.reduce((total, item) => {	
			const t = item.quantity;
			if(item.isSelected){
				return total + item.quantity - t;
			}
			else if(item.isSelected = false) {
				return t ;
			}
			return total + item.quantity ;
		}, 0);
		
		
		setTotalItemCount(totalItemCount);
	};
	

	return (
		<div className='app-background'>
			<div className='main-container'>
				<div className='add-item-box'>
					<input value={inputValue} onChange={(event) => setInputValue(event.target.value)} className='add-item-input' placeholder='Add an item...' />
					<FontAwesomeIcon icon={faPlus} onClick={e => {
                        handleAddButtonClick();
                        addItem(e);
                    }} />
				</div>
				<div className='item-list'>
					{items.map((item, index) => {
					return ( 
						<div className='item-container'>
							<div className='item-name' onClick={() => toggleComplete(index)}>
								{item.isSelected ? (
									<>
										<FontAwesomeIcon icon={faCheckCircle} />
										<span className='completed'>{item.itemName}</span>
									</>
								) : (
									<>
										<FontAwesomeIcon icon={faCircle} />
										<span>{item.itemName}</span>
									</>
								)}
		
							</div>
							<div className='quantity'>
								<button>
									<FontAwesomeIcon icon={faChevronLeft} onClick={() => handleQuantityDecrease(index)} />
								</button>
								<span> {item.quantity} </span>
								<button>
									<FontAwesomeIcon icon={faChevronRight} onClick={() => handleQuantityIncrease(index)} />
								</button>
								
							</div>
						</div>
					)
					})}
				</div>
				<div className='total'>Total: {totalItemCount}</div>
			</div>
		</div>
	);
};
export default App;
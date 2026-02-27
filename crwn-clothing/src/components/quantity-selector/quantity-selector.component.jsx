import { useContext } from 'react';
import { CartContext } from '../../contexts/cart.context';

import './quantity-selector.styles.scss';

const QuantitySelector = (item) => {
    const {  removeItemFromCart, addItemToCart } = useContext(CartContext);
    const cartItem = item.item;
    return (
        <div className='quantity-selector-container'>
            <div className='arrow' onClick={() => removeItemFromCart(cartItem)}>&#10094;</div>
            <span className='value'>{cartItem.quantity}</span>
            <div className='arrow' onClick={() => addItemToCart(cartItem)}>&#10095;</div>
        </div>
    );
}

export default QuantitySelector;
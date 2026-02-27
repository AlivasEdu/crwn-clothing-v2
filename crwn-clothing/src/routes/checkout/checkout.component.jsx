import { useContext } from 'react';

import { CartContext } from '../../contexts/cart.context';

import QuantitySelector from '../../components/quantity-selector/quantity-selector.component';

import './checkout.styles.scss';

const Checkout = () => {
    const { cartItems, clearItem } = useContext(CartContext);
    return (
        <div className='checkout-container'>
            <div className='checkout-header'>
                <span>Product</span>
                <span>Description</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Remove</span>
            </div>
            {cartItems.map(cartItem => {
                const { id, name, imageUrl, price, quantity } = cartItem;
                return (
                    <div key={id} className='checkout-item'>
                        <div className='image-container'>
                            <img src={imageUrl} alt={`${name}`} />
                        </div>
                        <span className='name'>{name}</span>
                        <QuantitySelector item={cartItem} />
                        <span className='price'>{price * quantity}</span>
                        <span className='remove-button' onClick={() => clearItem(cartItem)}>&#10005;</span>
                    </div>
                );
            })}
            <div className='total'>
                Total: {cartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)}
            </div>
        </div>
    );
}

export default Checkout;
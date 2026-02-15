import axios from 'axios';
import { useState } from 'react';
import { formatMoney } from '../../utils/money';

export function CartItemDetails({ cartItem, loadCart }) {
    const [quantity, setQuantity] = useState(false);

    function updateQuantity() {
        quantity ? setQuantity(false) : setQuantity(true);
    }

    const deleteCartItem = async () => {
        await axios.delete(`/api/cart-items/${cartItem.productId}`);
        await loadCart();
    };

    return (
        <>
            <img className="product-image"
                src={cartItem.product.image} />

            <div className="cart-item-details">
                <div className="product-name">
                    {cartItem.product.name}
                </div>
                <div className="product-price">
                    {formatMoney(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">
                    <span>
                        Quantity: {quantity
                            ? <input type="text" className='quantity-input' />
                            : <span className="quantity-label">{cartItem.quantity}</span>
                        }
                    </span>
                    <span className="update-quantity-link link-primary"
                        onClick={updateQuantity}>
                        Update
                    </span>
                    <span className="delete-quantity-link link-primary"
                        onClick={deleteCartItem}>
                        Delete
                    </span>
                </div>
            </div>
        </>
    );
}

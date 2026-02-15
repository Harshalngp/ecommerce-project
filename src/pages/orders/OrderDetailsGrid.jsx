import dayjs from 'dayjs';
import { Link } from 'react-router';
import { Fragment } from 'react';
import BuyAgainIcon from '../../assets/images/icons/buy-again.png';
import axios from 'axios';

export function OrderDetailsGrid({ order, loadCart }) {

    return (
        <div className="order-details-grid">
            {order.products.map((OrderProduct) => {
                const addToCart = async () => {
                    await axios.post('/api/cart-items', {
                        productId: OrderProduct.product.id,
                        quantity: 1
                    });

                    await loadCart();
                };

                return (
                    <Fragment key={OrderProduct.product.id}>
                        <div className="product-image-container">
                            <img src={OrderProduct.product.image} />
                        </div>

                        <div className="product-details">
                            <div className="product-name">
                                {OrderProduct.product.name}
                            </div>
                            <div className="product-delivery-date">
                                Arriving on: {dayjs(OrderProduct.estimatedDeliveryTimeMs).format('MMMM D')}
                            </div>
                            <div className="product-quantity">
                                Quantity: {OrderProduct.quantity}
                            </div>
                            <button className="buy-again-button button-primary" onClick={addToCart}>
                                <img className="buy-again-icon" src={BuyAgainIcon} />
                                <span className="buy-again-message">Add to Cart</span>
                            </button>
                        </div>

                        <div className="product-actions">
                            <Link to={`/tracking/${order.id}/${OrderProduct.product.id}`}>
                                <button className="track-package-button button-secondary">
                                    Track package
                                </button>
                            </Link>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
}

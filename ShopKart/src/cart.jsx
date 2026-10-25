import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, decrease, increase, removeFromCart, selectCartItems, selectTotalItems, selectTotalPrice } from './store/features/cart/cartSlice.js'

function Cart() {
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const itemCount = useSelector(selectTotalItems)
  const subtotal = useSelector(selectTotalPrice)
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-heading-row">
          <h1>Your cart <span>(0 items)</span></h1>
        </div>
        <div className="cart-empty-state">
          <div className="empty-cart-icon" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M3 5h3l3.2 14.1a3 3 0 0 0 2.9 2.3h12.1a3 3 0 0 0 2.9-2.2L30 10H8M12 27a1.5 1.5 0 1 0 0 .1M24 27a1.5 1.5 0 1 0 0 .1" /></svg></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you have not added anything yet. Browse the<br className="desktop-break" /> products and add your favourites.</p>
          <Link className="browse-products-button" to="/">Browse products</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="cart-heading-row">
        <h1>Your cart <span>({itemCount} items)</span></h1>
        <Link className="continue-shopping" to="/"><span aria-hidden="true">&lsaquo;</span> &nbsp;Continue shopping</Link>
      </div>

      <div className="cart-layout">
        <section className="cart-list" aria-label="Cart items">
          <div className="cart-list-heading">
            <span>Product</span>
            <button type="button" onClick={() => dispatch(clearCart())}>Clear cart</button>
          </div>
          {cartItems.map((item) => (
            <article className="cart-row" key={item.id}>
              <Link className="cart-product-image" to={`/product/${item.id}`}>
                <img src={item.image} alt="" />
              </Link>
              <div className="cart-product-info">
                <Link to={`/product/${item.id}`}>{item.title}</Link>
                <span className="cart-product-category">{item.category}</span>
                <span className="cart-unit-price">${item.price.toFixed(2)} each</span>
              </div>
              <div className="cart-quantity-stepper" aria-label={`Quantity for ${item.title}`}>
                <button type="button" onClick={() => dispatch(decrease(item.id))} aria-label="Decrease quantity">&#8722;</button>
                <strong>{item.quantity}</strong>
                <button type="button" onClick={() => dispatch(increase(item.id))} aria-label="Increase quantity">+</button>
              </div>
              <strong className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</strong>
              <button
                className="remove-cart-item"
                type="button"
                onClick={() => dispatch(removeFromCart(item.id))}
                aria-label={`Remove ${item.title}`}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 6h12M8 6V4h4v2m-6 0 1 10h6l1-10m-5 3v4m2-4v4" />
                </svg>
              </button>
            </article>
          ))}
        </section>

        <aside className="order-summary">
          <h2>Order summary</h2>
          <div><span>Items</span><span>{itemCount}</span></div>
          <div><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div><span>Shipping</span><strong>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong></div>
          <div className="summary-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div>
          <button className="checkout-button" type="button" onClick={() => setCheckoutMessage('Checkout is not connected yet.')}>Proceed to checkout</button>
          {checkoutMessage && <p className="checkout-message" role="status">{checkoutMessage}</p>}
          <p>Cart is saved with your browser. Refresh and it stays.</p>
        </aside>
      </div>
    </section>
  )
}

export default Cart

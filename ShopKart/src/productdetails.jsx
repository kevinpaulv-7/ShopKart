import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from './store/features/cart/cartSlice.js'

function ProductDetails() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct() {
      setLoading(true)
      setError('')
      try {
        const [productResponse, productsResponse] = await Promise.all([
          fetch(`https://fakestoreapi.com/products/${id}`, { signal: controller.signal }),
          fetch('https://fakestoreapi.com/products', { signal: controller.signal }),
        ])
        if (!productResponse.ok || !productsResponse.ok) {
          throw new Error('Could not load product information')
        }
        const [productData, productsData] = await Promise.all([
          productResponse.json(),
          productsResponse.json(),
        ])
        setProduct(productData)
        setProducts(productsData)
        setQuantity(1)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError('Could not load this product. Please try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [id])

  if (loading) return <p className="detail-message" role="status">Loading product…</p>
  if (error || !product) return <p className="detail-message error" role="alert">{error || 'Product not found.'}</p>

  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4)

  return (
    <section className="product-details-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Products</Link>
        <span>/</span>
        <span className="breadcrumb-category">{product.category}</span>
        <span>/</span>
        <strong>{product.title}</strong>
      </nav>

      <article className="detail-card">
        <div className="detail-gallery">
          <div className="detail-image-wrap">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="detail-thumbnails" aria-label="Product images">
            <button type="button" className="detail-thumbnail active" aria-label="Product image 1">
              <img src={product.image} alt="" />
            </button>
          </div>
        </div>

        <div className="detail-information">
          <span className="detail-category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="detail-rating">
            <span aria-hidden="true">★★★★★</span>
            <strong>{product.rating?.rate ?? '—'}</strong>
            <span className="review-count">({product.rating?.count ?? 0} reviews)</span>
          </p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-rule" />
          <div className="quantity-control">
            <span>Quantity</span>
            <div className="quantity-stepper" aria-label="Choose quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
              <strong>{quantity}</strong>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div className="detail-actions">
            <button type="button" className="detail-add-button" onClick={() => dispatch(addToCart({ product, quantity }))}>
              <span aria-hidden="true">🛒</span> Add to cart
            </button>
            <Link className="detail-cart-link" to="/cart">Go to cart</Link>
          </div>
          <ul className="detail-promises">
            <li><span aria-hidden="true">♧</span> Free shipping on orders of $100 or more</li>
            <li><span aria-hidden="true">↻</span> 30-day easy returns</li>
          </ul>
        </div>
      </article>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>You may also like</h2>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <Link className="related-card" to={`/product/${item.id}`} key={item.id}>
                <div className="related-image-wrap"><img src={item.image} alt={item.title} loading="lazy" /></div>
                <h3>{item.title}</h3>
                <strong>${item.price.toFixed(2)}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

export default ProductDetails

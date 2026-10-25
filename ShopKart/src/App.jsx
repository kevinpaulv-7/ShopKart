import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Cart from './cart.jsx'
import ProductDetails from './productdetails.jsx'
import { addToCart, decrease, increase, selectCartItems, selectTotalItems } from './store/features/cart/cartSlice.js'
import { fetchProducts } from './store/features/products/productsSlice.js'

const PRODUCTS_PER_PAGE = 8

function Home() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)
  const cartItems = useSelector(selectCartItems)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('default')

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [dispatch, status])

  const categories = [...new Set(products.map((product) => product.category))].sort()
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'low-high') return a.price - b.price
    if (sortOrder === 'high-low') return b.price - a.price
    return 0
  })
  const pageCount = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  const visibleProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  )

  function changeCategory(category) {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <section className="catalog">
      <div className="catalog-heading">
        <h1>All Products</h1>
        {status === 'succeeded' && (
          <p className="catalog-count">Showing {visibleProducts.length} of {sortedProducts.length} products</p>
        )}
      </div>
      {status === 'succeeded' && (
        <div className="catalog-toolbar">
          <label className="category-select-control">
            <span>Category</span>
            <select
              className="catalog-category-select"
              value={selectedCategory}
              onChange={(event) => changeCategory(event.target.value)}
            >
              <option value="all">All categories</option>
            {categories.map((category) => (
                <option value={category} key={category}>
                  {category.replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </option>
            ))}
            </select>
          </label>
          <label className="sort-control">
            <span>Sort by price</span>
            <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setCurrentPage(1) }}>
              <option value="default">Featured</option>
              <option value="low-high">Price: low to high</option>
              <option value="high-low">Price: high to low</option>
            </select>
          </label>
        </div>
      )}
      {status === 'loading' && <p className="catalog-message" role="status">Loading products...</p>}
      {status === 'failed' && (
        <div className="catalog-error" role="alert">
          <p>Could not load products. {error}</p>
          <button type="button" onClick={() => dispatch(fetchProducts())}>Try again</button>
        </div>
      )}
      {status === 'succeeded' && sortedProducts.length === 0 && <p className="catalog-message">No products in this category.</p>}
      {status === 'succeeded' && sortedProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id)
            return (
              <article className="product-card" key={product.id}>
                <Link className="product-card-link" to={`/product/${product.id}`}>
                  <div className="product-image-wrap"><img src={product.image} alt={product.title} loading="lazy" /></div>
                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h2>{product.title}</h2>
                  </div>
                </Link>
                <div className="product-footer">
                  <div className="product-meta">
                    <strong>${product.price.toFixed(2)}</strong>
                    <span aria-label={`Rated ${product.rating?.rate ?? 'not rated'} out of 5`}>{String.fromCodePoint(9733)} {product.rating?.rate ?? '?'}</span>
                  </div>
                  {cartItem ? (
                    <div className="catalog-quantity" aria-label={`Cart quantity for ${product.title}`}>
                      <button type="button" onClick={() => dispatch(decrease(product.id))} aria-label="Decrease quantity">&#8722;</button>
                      <strong>{cartItem.quantity}</strong>
                      <button type="button" onClick={() => dispatch(increase(product.id))} aria-label="Increase quantity">+</button>
                    </div>
                  ) : (
                    <button type="button" className="add-to-cart-button" onClick={() => dispatch(addToCart({ product }))}>Add to cart</button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
      {status === 'succeeded' && pageCount > 1 && (
        <nav className="pagination" aria-label="Product pages">
          <button type="button" className="pagination-button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button type="button" className={`pagination-button page-number${currentPage === page ? ' active' : ''}`} key={page} onClick={() => setCurrentPage(page)} aria-current={currentPage === page ? 'page' : undefined} aria-label={`Page ${page}`}>{page}</button>
          ))}
          <button type="button" className="pagination-button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount}>Next</button>
        </nav>
      )}
    </section>
  )
}

function App() {
  const [lightTheme, setLightTheme] = useState(true)
  const cartCount = useSelector(selectTotalItems)
  
  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <Link className="brand" to="/" aria-label="ShopKart home">
            Shop<span>Kart</span>
          </Link>
          <label className="search-box">
            <input type="search" placeholder="Search products" aria-label="Search products" />
          </label>
          <div className="nav-actions">
            <Link className="products-link" to="/">Products</Link>
            <Link className="cart-link" to="/cart">
              <span className="cart-icon" aria-hidden="true">{'\u{1F6D2}'}</span>
              <span>Cart</span>
              <span className="cart-count">{cartCount}</span>
            </Link>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setLightTheme((currentTheme) => !currentTheme)}
              aria-label={lightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
              title={lightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {lightTheme ? 'Dark' : 'Light'}
            </button>
          </div>
        </nav>
      </header>
      <main className={lightTheme ? 'page-content light' : 'page-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

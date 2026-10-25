import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { signal }) => {
  const response = await fetch('https://fakestoreapi.com/products', { signal })
  if (!response.ok) throw new Error(`Could not load products (${response.status})`)
  const products = await response.json()
  if (!Array.isArray(products)) throw new Error('The products response was invalid')
  return products
})

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.error.message || 'Unable to load products.'
      })
  },
})

export default productsSlice.reducer

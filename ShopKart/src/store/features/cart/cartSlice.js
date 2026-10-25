import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload
      const item = state.items.find((entry) => entry.id === product.id)
      if (item) item.quantity += quantity
      else state.items.push({ ...product, quantity })
    },
    increase(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload)
      if (item) item.quantity += 1
    },
    decrease(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload)
      if (!item) return
      if (item.quantity <= 1) {
        state.items = state.items.filter((entry) => entry.id !== action.payload)
      } else {
        item.quantity -= 1
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, increase, decrease, removeFromCart, clearCart } = cartSlice.actions
export const selectCartItems = (state) => state.cart.items
export const selectTotalItems = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectTotalPrice = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer

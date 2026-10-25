import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import cartReducer from './features/cart/cartSlice.js'
import productsReducer from './features/products/productsSlice.js'

const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
})

const persistedReducer = persistReducer({
  key: 'shopkart',
  storage,
  whitelist: ['cart'],
}, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
    },
  }),
})

export const persistor = persistStore(store)

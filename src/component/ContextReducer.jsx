// Updated ContextReducer.js
import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          price: action.price,
          qty: action.qty,
          size: action.size,
        },
      ];

    case 'REMOVE_ITEM':
      if (!action.payload || !action.payload.id || !action.payload.size) return state;
      return state.filter(
        item => !(item.id === action.payload.id && item.size === action.payload.size)
      );

    case 'UPDATE_ITEM':
      if (!action.id || !action.size) return state;
      return state.map(item =>
        item.id === action.id && item.size === action.size
          ? { ...item, qty: action.qty, price: action.price }
          : item
      );

    case 'CLEAR_CART':
    case 'DROP':
      return [];
    

      

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCartState = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);

import React, { useState, useEffect } from 'react';
import { useCartState, useDispatchCart } from './ContextReducer';

export default function Card(props) {
  const dispatch = useDispatchCart();
  const cartData = useCartState(); // ✅ Needed for checking existing cart items

  const options = props.options || {};
  const priceOptions = Object.keys(options);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(priceOptions.length > 0 ? priceOptions[0] : '');

  useEffect(() => {
    if (priceOptions.length > 0 && (!priceOptions.includes(size) || size === '')) {
      setSize(priceOptions[0]);
    } else if (priceOptions.length === 0 && size !== '') {
      setSize('');
    }
  }, [props.options]);

  const currentPrice = size && options[size] ? parseInt(options[size]) : 0;
  const totalPrice = currentPrice * qty;

  const handleAddToCart = async () => {
    const existingItem = cartData.find(
      (item) => item.id === props.foodItem._id && item.size === size
    );

    if (existingItem) {
      await dispatch({
        type: "UPDATE_ITEM",
        id: props.foodItem._id,
        price: totalPrice + existingItem.price,
        qty: existingItem.qty + qty,
        size: size,
      });
      console.log(`Updated ${props.foodItem.name} (${size}) to ${existingItem.qty + qty} for ₹${totalPrice + existingItem.price} in cart!`);
      return;
    }

    await dispatch({
      type: "ADD_ITEM",
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: totalPrice,
      qty: qty,
      size: size,
    });
    console.log(`Added ${qty} of ${props.foodItem.name} (${size}) for ₹${totalPrice} to cart!`);
  };

  return (
    <div className="card mt-3" style={{ width: "18rem", maxHeight: "400px", borderRadius: "10px" }}>
      <img
        src={props.foodItem.img}
        className="card-img-top"
        alt={props.foodItem.name || "Food Item"}
        style={{ objectFit: "cover", height: "180px" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{props.foodItem.name}</h5>
        <p className="card-text flex-grow-1">This is some important content related to the food item.</p>

        <div className="container w-100 mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <select
              className="m-2 h-100 bg-success text-white rounded"
              onChange={(e) => setQty(parseInt(e.target.value))}
              value={qty}
            >
              {[...Array(6).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select
              className="m-2 h-100 bg-success text-white rounded"
              onChange={(e) => setSize(e.target.value)}
              value={size}
              disabled={priceOptions.length === 0}
            >
              {priceOptions.length > 0 ? (
                priceOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))
              ) : (
                <option value="">N/A</option>
              )}
            </select>

            <div className="d-inline h-100 fs-5">
              ₹{totalPrice}/-
            </div>
          </div>

          <hr className="mt-3" />
          <button
            className="btn btn-warning justify-content-center ms-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

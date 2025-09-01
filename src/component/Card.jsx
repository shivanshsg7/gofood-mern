import React, { useState, useEffect } from 'react';
import { useCartState, useDispatchCart } from './ContextReducer';

export default function Card(props) {
  const dispatch = useDispatchCart();
  const cartData = useCartState(); // ✅ Needed for checking existing cart items

  // Handle both foodItem object and individual props
  const foodItem = props.foodItem || {
    _id: props.foodName, // Use foodName as fallback ID
    name: props.foodName,
    img: props.imgsrc
  };

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
      (item) => item.id === foodItem._id && item.size === size
    );

    if (existingItem) {
      await dispatch({
        type: "UPDATE_ITEM",
        id: foodItem._id,
        price: totalPrice + existingItem.price,
        qty: existingItem.qty + qty,
        size: size,
      });
      console.log(`Updated ${foodItem.name} (${size}) to ${existingItem.qty + qty} for ₹${totalPrice + existingItem.price} in cart!`);
      return;
    }

    await dispatch({
      type: "ADD_ITEM",
      id: foodItem._id,
      name: foodItem.name,
      price: totalPrice,
      qty: qty,
      size: size,
    });
    console.log(`Added ${qty} of ${foodItem.name} (${size}) for ₹${totalPrice} to cart!`);
  };

  return (
    <div className="card product-card hover-lift mt-3 h-100 d-flex flex-column" style={{ width: "18rem", borderRadius: "14px" }}>
      <img
        src={foodItem.img}
        className="card-img-top"
        alt={foodItem.name || "Food Item"}
        style={{ objectFit: "cover", height: "200px" }}
      />
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">{foodItem.name}</h5>
        <p className="card-text flex-grow-1 mb-3">Delicious, freshly prepared and served hot. Customize size and quantity.</p>

        <div className="container w-100 mt-auto">
          <div className="d-flex justify-content-between align-items-center option-row">
            <select
              className="m-2 select-control"
              onChange={(e) => setQty(parseInt(e.target.value))}
              value={qty}
            >
              {[...Array(6).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select
              className="m-2 select-control size-select"
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

            <div className="d-inline h-100 fs-5 price-chip">
              ₹{totalPrice}/-
            </div>
          </div>

          <hr className="mt-3" />
          <button
            className="btn btn-brand justify-content-center ms-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useCartState, useDispatchCart } from './ContextReducer';

export default function Card(props) {
  const dispatch = useDispatchCart();
  const cartData = useCartState(); // ✅ Needed for checking existing cart items

  // Handle both foodItem object and individual props
  const foodItem = props.foodItem || {
    _id: props.foodName,
    name: props.foodName,
  img: props.imgsrc || 'https://placehold.co/300x200?text=No+Image',
    description: 'Delicious, freshly prepared and served hot.'
  };

  // Fallback for missing options
  const options = props.options && Object.keys(props.options).length > 0 ? props.options : { Regular: 0 };
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
    <div
      className="card product-card mt-3 h-100 d-flex flex-column shadow-soft"
      style={{
        width: "19rem",
        borderRadius: "16px",
        boxShadow: "0 6px 24px rgba(34,197,94,0.10)",
        border: "1px solid #e5e7eb",
        background: "#18181b"
      }}
    >
      <img
        src={foodItem.img || 'https://placehold.co/300x200?text=No+Image'}
        className="card-img-top"
        alt={foodItem.name || "Food Item"}
        style={{
          objectFit: "cover",
          height: "200px",
          background: '#222',
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px"
        }}
        onError={e => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/300x200?text=No+Image';
        }}
      />
      <div className="card-body d-flex flex-column flex-grow-1" style={{ padding: "1.2rem" }}>
        <h5 className="card-title fw-bold text-success mb-2" style={{ fontSize: "1.25rem", letterSpacing: "0.5px" }}>{foodItem.name}</h5>
        <p className="card-text flex-grow-1 mb-3 text-light" style={{ fontSize: "1rem", minHeight: "48px" }}>{foodItem.description || 'Delicious, freshly prepared and served hot. Customize size and quantity.'}</p>

        <div className="container w-100 mt-auto">
          <div className="d-flex justify-content-between align-items-center option-row mb-2">
            <select
              className="form-select form-select-sm m-2"
              style={{ maxWidth: "80px", borderRadius: "8px" }}
              onChange={(e) => setQty(parseInt(e.target.value))}
              value={qty}
            >
              {[...Array(6).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select
              className="form-select form-select-sm m-2"
              style={{ maxWidth: "100px", borderRadius: "8px" }}
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

            <div className="d-inline h-100 fs-5 price-chip text-brand-accent fw-bold" style={{ minWidth: "80px", textAlign: "right" }}>
              ₹{totalPrice}/-
            </div>
          </div>

          <hr className="mt-3" />
          <button
            className="btn btn-success w-100 fw-bold py-2"
            style={{ borderRadius: "8px", fontSize: "1.05rem" }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

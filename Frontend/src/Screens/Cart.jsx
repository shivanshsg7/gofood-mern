import React from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCartState, useDispatchCart } from '../component/ContextReducer';

export default function Cart() {

  const data = useCartState();
  const dispatch = useDispatchCart();

  // Accept onClose prop from Modal
  const onClose = typeof window !== 'undefined' && window.cartModalOnClose ? window.cartModalOnClose : (typeof arguments[0] === 'object' && arguments[0]?.onClose ? arguments[0].onClose : undefined);

  if (data.length === 0) {
    return (
      <div className="m-5 w-100 text-center fs-3">
        <div className="cart-modal-header d-flex justify-content-between align-items-center mb-4">
          <span className="fw-bold fs-2">My Cart</span>
          {onClose && (
            <button className="btn btn-outline-danger btn-lg px-3 py-1" style={{borderRadius: '50%'}} onClick={onClose}>&times;</button>
          )}
        </div>
        <div className="py-5">The Cart is Empty!</div>
      </div>
    );
  }

const handleCheckOut = async () => {
  const userEmail = localStorage.getItem("userEmail");
  const totalPrice = data.reduce((total, item) => total + item.price, 0);

  try {
    // 1) Ask backend to create Razorpay order
    const orderRes = await fetch("https://gofood-mern-pjgu.onrender.com/api/create-razorpay-order", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice })
    });
    if (!orderRes.ok) throw new Error(`Order create failed: ${orderRes.status}`);
    const { orderId, amount, currency, keyId } = await orderRes.json();

    // 2) Open Razorpay checkout
    const options = {
      key: keyId,
      amount,
      currency,
      name: 'Food Order',
      description: 'Checkout',
      order_id: orderId,
      prefill: { email: userEmail || '' },
      theme: { color: '#0aad0a' },
      handler: async function (response) {
        try {
          // 3) Verify on backend and save order
          const verifyRes = await fetch("http://localhost:5000/api/verify-razorpay-payment", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: userEmail,
              order_data: data,
            })
          });
          if (!verifyRes.ok) throw new Error(`Verify failed: ${verifyRes.status}`);
          const verifyJson = await verifyRes.json();
          console.log('Payment verified:', verifyJson);
          dispatch({ type: 'DROP' });
          alert('Payment successful and order placed!');
        } catch (err) {
          console.error('Verification error:', err);
          alert('Payment verification failed');
        }
      },
      modal: {
        ondismiss: function () {
          console.log('Checkout form closed');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Checkout failed: ' + error.message);
  }
};

  const totalPrice = data.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container m-auto mt-4 p-4 rounded-4 shadow-soft cart-modal-content" style={{background: 'var(--surface-2)', minWidth: '340px', maxWidth: '600px'}}>
      <div className="cart-modal-header d-flex justify-content-between align-items-center mb-4">
        <span className="fw-bold fs-2">My Cart</span>
        {onClose && (
          <button className="btn btn-outline-danger btn-lg px-3 py-1" style={{borderRadius: '50%'}} onClick={onClose}>&times;</button>
        )}
      </div>
      <table className="table table-hover table-dark rounded-3 overflow-hidden">
        <thead className="text-success fs-5">
          <tr style={{background: 'rgba(34,197,94,0.08)'}}>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Qty</th>
            <th scope="col">Size</th>
            <th scope="col">Amount</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((food, index) => (
            <tr key={index} className="align-middle">
              <th scope="row">{index + 1}</th>
              <td className="fw-semibold">{food.name}</td>
              <td>{food.qty}</td>
              <td className="text-lowercase">{food.size}</td>
              <td className="fw-bold">₹{food.price}</td>
              <td>
                <button type="button" className="btn btn-sm btn-outline-danger px-2 py-1" title="Remove">
                  <Delete
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_ITEM",
                        payload: {
                          id: food.id,
                          size: food.size,
                        },
                      })
                    }
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <span className="fs-4 fw-bold">Total:</span>
        <span className="fs-3 fw-bold text-success">₹{totalPrice}/-</span>
      </div>
      <div className="d-grid gap-2 mt-3">
        <button className="btn btn-brand btn-lg fw-bold py-2" style={{fontSize: '1.2rem'}} onClick={handleCheckOut}>
          Check Out
        </button>
      </div>
    </div>
  );
}

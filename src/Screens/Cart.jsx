import React from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCartState, useDispatchCart } from '../component/ContextReducer';

export default function Cart() {
  const data = useCartState();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
    );
  }

const handleCheckOut = async () => {
  const userEmail = localStorage.getItem("userEmail");
  const totalPrice = data.reduce((total, item) => total + item.price, 0);

  try {
    if (!totalPrice || totalPrice <= 0) {
      alert('Cart total must be greater than 0 to proceed to payment.');
      return;
    }
    if (typeof window === 'undefined' || !window.Razorpay) {
      alert('Razorpay SDK failed to load. Please check your internet and refresh.');
      return;
    }
    // 1) Ask backend to create Razorpay order
    const orderRes = await fetch("http://localhost:5000/api/create-razorpay-order", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice })
    });
    if (!orderRes.ok) {
      try {
        const errJson = await orderRes.json();
        throw new Error(errJson.error || JSON.stringify(errJson));
      } catch (_) {
        const errText = await orderRes.text();
        throw new Error(errText || `Order create failed: ${orderRes.status}`);
      }
    }
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
    <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
      <table className="table table-hover">
        <thead className="text-success fs-4">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Option</th>
            <th scope="col">Amount</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((food, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{food.name}</td>
              <td>{food.qty}</td>
              <td>{food.size}</td>
              <td>{food.price}</td>
              <td>
                <button type="button" className="btn p-0">
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
      <div>
        <h1 className="fs-2">Total Price: ₹{totalPrice}/-</h1>
      </div>
      <div>
        <button className="btn bg-success mt-5" onClick={handleCheckOut}>
          Check Out
        </button>
      </div>
    </div>
  );
}

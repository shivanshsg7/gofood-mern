import React, { useState } from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCartState, useDispatchCart } from '../component/ContextReducer';
import Payment from '../component/Payment';

export default function Cart() {
  const data = useCartState();
  const dispatch = useDispatchCart();
  const [showPayment, setShowPayment] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);

  const handleCheckOut = () => {
    // Show payment component instead of directly placing order
    console.log('Checkout button clicked!');
    console.log('Current showPayment state:', showPayment);
    setShowPayment(true);
    console.log('showPayment set to true');
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    const userEmail = localStorage.getItem("userEmail");
    setOrderProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString(),
          payment_status: 'paid',
          payment_id: paymentDetails.paymentId,
          razorpay_order_id: paymentDetails.orderId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Order Response:", result);
      
      // Clear cart and hide payment
      dispatch({ type: "DROP" });
      setShowPayment(false);
      setOrderProcessing(false);
      
      alert("Order placed successfully! Payment ID: " + paymentDetails.paymentId);
      
    } catch (error) {
      console.error("Order placement error:", error.message);
      setOrderProcessing(false);
      alert("Payment successful but failed to save order: " + error.message);
    }
  };

  const handlePaymentFailure = (error) => {
    setOrderProcessing(false);
    alert("Payment failed: " + error);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (data.length === 0) {
    return (
      <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
    );
  }

  const totalPrice = data.reduce((total, item) => total + item.price, 0);

  // Debug logging
  console.log('Cart component rendered');
  console.log('showPayment state:', showPayment);
  console.log('data length:', data.length);
  console.log('totalPrice:', totalPrice);

  return (
    <div className="container m-auto mt-5">
      {!showPayment ? (
        <div className="table-responsive table-responsive-sm table-responsive-md">
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
            <button 
              className={`btn bg-success mt-5 ${orderProcessing ? 'disabled' : ''}`}
              onClick={handleCheckOut}
              disabled={orderProcessing}
            >
              {orderProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Complete Your Payment</h4>
              </div>
              <div className="card-body">
                <Payment
                  amount={totalPrice}
                  orderData={data}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailure={handlePaymentFailure}
                  onCancel={handlePaymentCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

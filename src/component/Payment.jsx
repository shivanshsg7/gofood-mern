import React, { useState } from 'react';

const Payment = ({ amount, orderData, onPaymentSuccess, onPaymentFailure, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create order on backend
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Razorpay options
      const options = {
        key: orderData.key_id, // Key ID from backend
        amount: orderData.order.amount, // Amount in paise
        currency: orderData.order.currency,
        name: 'Food Delivery App',
        description: 'Payment for your order',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData, // Include order data if needed
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              // Payment successful
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
            } else {
              throw new Error(verifyResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onPaymentFailure(error.message);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || 'Customer',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || '',
        },
        notes: {
          order_type: 'food_delivery',
          items_count: orderData.length || 0,
        },
        theme: {
          color: '#28a745', // Green color matching your app theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            onCancel && onCancel();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        
        // Send failure info to backend
        fetch('http://localhost:5000/api/payment/payment-failed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: response.error,
            order_id: orderData.order.id,
          }),
        });

        onPaymentFailure(response.error.description || 'Payment failed');
        setLoading(false);
      });

      razorpay.open();
      setLoading(false);

    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      onPaymentFailure(error.message);
    }
  };

  return (
    <div className="payment-component">
      <div className="payment-summary mb-3">
        <h5>Payment Summary</h5>
        <div className="d-flex justify-content-between">
          <span>Total Amount:</span>
          <span className="fw-bold">₹{amount}/-</span>
        </div>
      </div>
      
      <button
        className={`btn btn-success w-100 ${loading ? 'disabled' : ''}`}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Processing...
          </>
        ) : (
          <>
            Pay ₹{amount} with Razorpay
          </>
        )}
      </button>
      
      <div className="text-center mt-2">
        <small className="text-muted">
          Secure payment powered by Razorpay
        </small>
      </div>
      
      <div className="mt-3">
        <button
          className="btn btn-outline-secondary w-100"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Payment;
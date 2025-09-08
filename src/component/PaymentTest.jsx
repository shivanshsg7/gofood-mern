import React, { useState } from 'react';

const PaymentTest = () => {
  const [showPayment, setShowPayment] = useState(false);

  const handleTestClick = () => {
    console.log('Test button clicked!');
    setShowPayment(!showPayment);
    console.log('showPayment toggled to:', !showPayment);
  };

  return (
    <div className="container mt-5">
      <h3>Payment Test Component</h3>
      <button 
        className="btn btn-primary" 
        onClick={handleTestClick}
      >
        Toggle Payment View (Current: {showPayment ? 'Payment' : 'Cart'})
      </button>
      
      {showPayment ? (
        <div className="mt-3 p-3 border border-success">
          <h4>Payment Component Would Be Here</h4>
          <p>This is where the payment component should render</p>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowPayment(false)}
          >
            Cancel Payment
          </button>
        </div>
      ) : (
        <div className="mt-3 p-3 border border-primary">
          <h4>Cart View</h4>
          <p>This is the cart view</p>
        </div>
      )}
    </div>
  );
};

export default PaymentTest;
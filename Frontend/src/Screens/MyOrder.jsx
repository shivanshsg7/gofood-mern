import React, { useEffect, useState } from 'react';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const res = await fetch("https://gofood-mern-pjgu.onrender.com/api/myorderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail')
        })
      });

      const response = await res.json();
      setOrderData(response.orderData.order_data || []);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div style={{background: 'var(--surface)', minHeight: '100vh'}}>
      <Navbar />
      <div className='container py-4'>
        <div className='row'>
          {orderData.length > 0 ? (
            orderData.slice(0).reverse().map((orderGroup, index) => {
              const dateEntry = orderGroup.find(obj => obj.order_date);
              const orderDate = dateEntry ? new Date(dateEntry.order_date).toLocaleString() : "Unknown Date";

              return (
                <div key={index} className="mb-5">
                  <div className='bg-dark rounded-4 shadow-soft p-4 mb-3' style={{borderLeft: '6px solid var(--brand-accent)', boxShadow: '0 6px 24px rgba(34,197,94,0.08)'}}>
                    <h5 className="fw-bold text-success mb-2" style={{fontSize: '1.3rem'}}>Order Date: {orderDate}</h5>
                    <hr />
                    <div className='row'>
                      {orderGroup.map((item, idx) =>
                        item.name ? (
                          <div className='col-12 col-md-6 col-lg-3' key={idx}>
                            <div className="card product-card hover-lift mt-3 h-100 d-flex flex-column" style={{ width: "16rem", borderRadius: "14px", background: 'var(--surface-2)', color: 'white', boxShadow: '0 10px 25px var(--shadow-color)' }}>
                              <div className="card-body d-flex flex-column flex-grow-1">
                                <h5 className="card-title fw-bold text-success">{item.name}</h5>
                                <div className='container w-100 p-0 mb-2'>
                                  <span className='badge bg-success me-2'>Qty: {item.qty}</span>
                                  <span className='badge bg-secondary me-2 text-lowercase'>Size: {item.size}</span>
                                </div>
                                <div className='d-inline ms-2 h-100 w-20 fs-5 fw-bold text-success'>
                                  ₹{item.price}/-
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-5 fs-4 text-muted">No orders found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

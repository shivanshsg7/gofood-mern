import React, { useEffect, useState } from 'react';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/myorderData", {
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
    <div>
      <Navbar />
      <div className='container'>
        <div className='row'>
          {orderData.length > 0 ? (
            orderData.slice(0).reverse().map((orderGroup, index) => {
              const dateEntry = orderGroup.find(obj => obj.order_date);
              const orderDate = dateEntry ? new Date(dateEntry.order_date).toLocaleString() : "Unknown Date";

              return (
                <div key={index}>
                  <div className='m-auto mt-5'>
                    <h5>Order Date: {orderDate}</h5>
                    <hr />
                  </div>

                  <div className='row'>
                    {orderGroup.map((item, idx) =>
                      item.name ? (
                        <div className='col-12 col-md-6 col-lg-3' key={idx}>
                          <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                            <div className="card-body">
                              <h5 className="card-title">{item.name}</h5>
                              <div className='container w-100 p-0'>
                                <span className='m-1'>Qty: {item.qty}</span>
                                <span className='m-1'>Size: {item.size}</span>
                                <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                  ₹{item.price}/-
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center">No orders found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

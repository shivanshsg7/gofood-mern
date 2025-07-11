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

  try {
    const response = await fetch("http://localhost:5000/api/orderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Order Response:", await response.json());
    dispatch({ type: "DROP" });
  } catch (error) {
    console.error("Fetch error:", error.message);
    alert("Failed to place order: " + error.message);
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

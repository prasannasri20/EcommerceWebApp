import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(items);
  }, []);

  function removeFromCart(indexToRemove) {
  const updated = cart.filter((_, idx) => idx !== indexToRemove);
  setCart(updated);
  localStorage.setItem('cart', JSON.stringify(updated));
}


  return (
    <div className="p-6">
       <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item,index) => (
          <div key={`${item._id}-${index} `}className="border p-4 mb-4 rounded shadow flex justify-between items-center">
            <div>
              <h2>{item.name}</h2>
              <p>${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(index)}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

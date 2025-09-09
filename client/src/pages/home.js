import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [search, setSearch] = useState('');

  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem('cart'))?.length || 0
  );

  const navigate = useNavigate();

  const buildFilterParams = (category, price, search) => {
    const params = {};
    if (category) params.category = category;
    if (price === 'low') params.priceMax = 50;
    else if (price === 'high') params.priceMin = 50;
    if (search) params.search = search;
    return params;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items', {
        params: buildFilterParams(category, price, search),
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  }, [category, price, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
  };

  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Listing</h1>
        <button
  onClick={() => navigate('/products')}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
 View Products
</button>
        <button
  onClick={() => navigate('/cart')}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
  Cart ({cartCount})
</button>


      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <div className="mb-4 flex gap-4">
        <select onChange={(e) => setCategory(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
        </select>
        <select onChange={(e) => setPrice(e.target.value)} className="border p-2">
          <option value="">Any Price</option>
          <option value="low">Under ₹50</option>
          <option value="high">Over ₹50</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-gray-700">₹{item.price}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

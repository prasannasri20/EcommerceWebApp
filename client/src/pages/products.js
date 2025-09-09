import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function ProductManager() {
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null); // null = add mode

  // 🔄 Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://ecommercewebapp-zs77.onrender.com/api/items');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('❌ Failed to fetch products:', err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔄 Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      const url = editingId
        ? `https://ecommercewebapp-zs77.onrender.com/api/items/${editingId}`
        : 'https://ecommercewebapp-zs77.onrender.com/api/items';

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error saving item');
      }

      const data = await res.json();
      console.log(`✅ Item ${editingId ? 'updated' : 'created'}:`, data);

      // Reset form and refetch
      setFormData({ name: '', description: '', price: '', category: '' });
      setEditingId(null);
      fetchProducts();

    } catch (err) {
      console.error('❌ Submit error:', err.message);
    }
  };

  // 🛠️ Edit product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category
    });
    setEditingId(product.id); // Or product.id depending on backend
  };

  // ❌ Delete product
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://ecommercewebapp-zs77.onrender.com/api/items/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error deleting item');
      }

      console.log('🗑️ Item deleted');
      fetchProducts();

    } catch (err) {
      console.error('❌ Delete error:', err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>

      <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 block w-full"
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 block w-full"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 block w-full"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 block w-full"
          required
        >
          <option value="">Select Category</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Save'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">📦 Product List</h3>
      <ul className="space-y-2">
        {products.map(product => (
          <li key={product._id} className="border p-4 flex justify-between items-start">
            <div>
              <p><strong>{product.name}</strong> (${product.price})</p>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-xs text-gray-500">Category: {product.category}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

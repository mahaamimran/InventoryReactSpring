import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryApp() {
  const [inventory, updateInventory] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: '', quantity: '', price: '' });

  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/items');
      updateInventory(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();
    const method = currentItem.id ? 'put' : 'post';
    const url = currentItem.id ? `http://localhost:8080/api/items/${currentItem.id}` : 'http://localhost:8080/api/items';
    
    try {
      await axios[method](url, currentItem);
      loadInventoryItems(); // Refresh inventory
      setCurrentItem({ name: '', quantity: '', price: '' }); // Clear form
    } catch (error) {
      console.error('Failed to submit item:', error);
    }
  };

  const startEditItem = (item) => {
    setCurrentItem(item);
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/items/${id}`);
      loadInventoryItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', padding: '40px', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '1px solid #666' }}>Inventory Dashboard</h1>
      <form onSubmit={handleItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Enter item name"
          value={currentItem.name}
          onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
          required
          style={{ padding: '12px', background: 'none', border: '2px solid #666', color: 'white' }}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          value={currentItem.quantity}
          onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })}
          required
          style={{ padding: '12px', background: 'none', border: '2px solid #666', color: 'white' }}
        />
        <input
          type="text"
          name="price"
          placeholder="Enter price"
          value={currentItem.price}
          onChange={e => setCurrentItem({ ...currentItem, price: e.target.value })}
          required
          style={{ padding: '12px', background: 'none', border: '2px solid #666', color: 'white' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#444', color: 'white', border: 'none' }}>
          {currentItem.id ? 'Update Item' : 'Add Item'}
        </button>
      </form>
      <section style={{ marginTop: '30px' }}>
        <h2 style={{ borderBottom: '1px solid #666' }}>Inventory List</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '20px' }}>
          {inventory.map((item) => (
            <li key={item.id} style={{ padding: '10px', borderBottom: '1px solid #444' }}>
              <span>{item.name} - Qty: {item.quantity} - $ {item.price.toFixed(2)}</span>
              <button onClick={() => startEditItem(item)} style={{ margin: '10px', backgroundColor: '#555', color: 'white', border: 'none', padding: '5px' }}>Edit</button>
              <button onClick={() => removeItem(item.id)} style={{ backgroundColor: '#900', color: 'white', border: 'none', padding: '5px' }}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default InventoryApp;

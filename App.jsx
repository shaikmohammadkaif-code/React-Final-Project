import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Fetch products from API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`Added to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* NAVBAR */}
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => { setSelectedProduct(null); setActivePage('home'); }} className="text-xl font-extrabold text-indigo-400 cursor-pointer">
            🛍️ ShopHub
          </button>
          <div className="flex gap-6 items-center font-medium">
            <button onClick={() => { setSelectedProduct(null); setActivePage('home'); }} className="hover:text-indigo-300 cursor-pointer">Home</button>
            <button onClick={() => { setSelectedProduct(null); setActivePage('products'); }} className="hover:text-indigo-300 cursor-pointer">Products</button>
            <button onClick={() => { setSelectedProduct(null); setActivePage('dashboard'); }} className="hover:text-indigo-300 cursor-pointer">Dashboard</button>
            <button onClick={() => { setSelectedProduct(null); setActivePage('contact'); }} className="hover:text-indigo-300 cursor-pointer">Contact</button>
            <button onClick={() => { setSelectedProduct(null); setActivePage('cart'); }} className="relative bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer">
              🛒 Cart ({cart.reduce((a, c) => a + c.quantity, 0)})
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {selectedProduct ? (
          // PRODUCT DETAIL PAGE
          <div className="max-w-4xl mx-auto px-6 py-12">
            <button onClick={() => setSelectedProduct(null)} className="text-slate-600 mb-6 hover:text-indigo-600 font-medium cursor-pointer">← Back</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow border">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-80 object-contain" />
              <div>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded uppercase font-semibold">{selectedProduct.category}</span>
                <h1 className="text-2xl font-bold text-slate-800 mt-3">{selectedProduct.title}</h1>
                <p className="text-3xl font-extrabold text-indigo-600 my-4">${selectedProduct.price}</p>
                <p className="text-slate-600 text-sm">{selectedProduct.description}</p>
                <button onClick={() => addToCart(selectedProduct)} className="mt-6 bg-indigo-600 text-white w-full py-3 rounded-xl font-semibold hover:bg-indigo-700 cursor-pointer">Add to Cart</button>
              </div>
            </div>
          </div>
        ) : activePage === 'home' ? (
          // HOME PAGE
          <div className="text-center py-24 px-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
            <h1 className="text-5xl font-extrabold mb-4">Discover Quality Products</h1>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">Explore electronics, apparel, and accessories with fast delivery.</p>
            <button onClick={() => setActivePage('products')} className="bg-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 cursor-pointer">Shop Now →</button>
          </div>
        ) : activePage === 'products' ? (
          // PRODUCTS PAGE
          <div className="max-w-7xl mx-auto px-6 py-8">
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-80 px-4 py-2 border rounded-xl mb-6 bg-white" />
            {loading ? <p className="text-center py-12">Loading...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow border p-4 flex flex-col justify-between">
                    <div>
                      <img src={product.image} alt={product.title} className="w-full h-48 object-contain mb-4" />
                      <h2 className="font-semibold text-slate-800 line-clamp-1">{product.title}</h2>
                      <p className="text-indigo-600 font-bold mt-1">${product.price}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => setSelectedProduct(product)} className="flex-1 bg-slate-100 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 cursor-pointer">Details</button>
                      <button onClick={() => addToCart(product)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer">Add</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activePage === 'cart' ? (
          // CART PAGE
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            {cart.length === 0 ? <p className="text-slate-500">Your cart is empty.</p> : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-indigo-600 font-bold">${item.price} x {item.quantity}</p>
                      </div>
                    </div>
                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-500 font-semibold cursor-pointer">Remove</button>
                  </div>
                ))}
                <button onClick={() => { alert('Order placed!'); setCart([]); }} className="bg-indigo-600 text-white w-full py-3 rounded-xl font-semibold mt-4 cursor-pointer">Checkout</button>
              </div>
            )}
          </div>
        ) : activePage === 'dashboard' ? (
          // DASHBOARD / CRUD PAGE
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Inventory (CRUD)</h1>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <p className="text-slate-600 mb-4">Manage products, view inventory status, and add new stock items.</p>
              <div className="bg-indigo-50 p-4 rounded-lg text-indigo-900 font-medium">System Status: Active & Operational 🚀</div>
            </div>
          </div>
        ) : (
          // CONTACT PAGE
          <div className="max-w-md mx-auto px-6 py-16 bg-white rounded-2xl shadow border mt-10">
            <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
            <input type="text" placeholder="Your Name" className="w-full border p-3 rounded-xl mb-4" />
            <input type="email" placeholder="Email Address" className="w-full border p-3 rounded-xl mb-4" />
            <textarea placeholder="Message" rows="3" className="w-full border p-3 rounded-xl mb-4"></textarea>
            <button onClick={() => alert('Message Sent!')} className="bg-indigo-600 text-white w-full py-3 rounded-xl font-semibold cursor-pointer">Send</button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 mt-16">
        <p>&copy; 2026 ShopHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
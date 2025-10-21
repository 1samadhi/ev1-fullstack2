import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

const Carrito = () => {
  const [cart, setCart] = useState([]); // Estado: items actuales en el carrito (id, nombre, precio, quantity)

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(data);
  };

  const saveCart = (next) => {
    localStorage.setItem('cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cartUpdated'));
    setCart(next);
  };

  useEffect(() => {
    loadCart();
    const onExternal = () => loadCart();
    window.addEventListener('storage', onExternal);
    window.addEventListener('cartUpdated', onExternal);
    return () => {
      window.removeEventListener('storage', onExternal);
      window.removeEventListener('cartUpdated', onExternal);
    };
  }, []);

  const total = useMemo(() => cart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0), [cart]);

  const updateQty = (id, qty) => {
    const next = cart.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i);
    saveCart(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((i) => i.id !== id);
    saveCart(next);
  };

  const clearCart = () => {
    saveCart([]);
  };

  if (cart.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>
        <div className="bg-white border rounded-md p-6 text-center">
          <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
          <Link to="/productos" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white border rounded-md p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{formatPrice(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded-md"
                    onClick={() => updateQty(item.id, (item.quantity || 1) - 1)}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value || '1', 10))}
                    className="w-16 text-center border rounded-md py-1"
                  />
                  <button
                    className="px-2 py-1 border rounded-md"
                    onClick={() => updateQty(item.id, (item.quantity || 1) + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-semibold">{formatPrice(item.price * (item.quantity || 1))}</span>
                <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-left text-red-600 hover:underline">Vaciar carrito</button>
        </div>

        <aside className="bg-white border rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold">{formatPrice(total)}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">El envío y descuentos se calculan en el checkout.</p>
          <button className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700">Proceder al pago</button>
          <Link to="/productos" className="block text-center mt-3 text-emerald-700 hover:underline">Seguir comprando</Link>
        </aside>
      </div>
    </section>
  );
};

export default Carrito;
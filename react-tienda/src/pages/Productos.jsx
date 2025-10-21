import React, { useEffect, useMemo, useState } from 'react';

const Productos = () => {
  const [products, setProducts] = useState([]); // Estado: catálogo de productos
  const [query, setQuery] = useState(''); // Estado: término de búsqueda
  const [category, setCategory] = useState(''); // Estado: filtro por categoría
  const [sortBy, setSortBy] = useState('createdAt'); // Estado: criterio de orden (precio, nombre, fecha)
  const [sortDir, setSortDir] = useState('desc'); // Estado: dirección del orden (asc/desc)
  const [notice, setNotice] = useState(''); // Estado: aviso UI al añadir al carrito

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let data = products.filter(p =>
      (!category || p.category === category) &&
      (!query || p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(query.toLowerCase()))
    );

    data.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'price') return (a.price - b.price) * dir;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return (da - db) * dir;
    });

    return data;
  }, [products, query, category, sortBy, sortDir]);

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((item) => item.id === product.id);
    if (idx !== -1) {
      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setNotice(`"${product.name}" añadido al carrito`);
    setTimeout(() => setNotice(''), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-md px-3 py-2 w-full md:w-64"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="createdAt">Fecha</option>
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      {notice && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-md">
          {notice}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center text-gray-600">No hay productos para mostrar</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-md shadow hover:shadow-lg transition-shadow overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
              <div className="p-4">
                <div className="text-sm text-emerald-600 font-medium">{product.category}</div>
                <h3 className="text-lg font-semibold mt-1 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                  <button onClick={() => addToCart(product)} className="bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700 text-sm">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Productos;
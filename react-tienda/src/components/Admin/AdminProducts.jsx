import React, { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  id: null,
  name: '',
  price: '',
  category: '',
  description: '',
  image: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]); // Estado: lista de productos cargados desde localStorage
  const [form, setForm] = useState(emptyForm); // Estado: formulario de creación/edición de producto
  const [editingId, setEditingId] = useState(null); // Estado: ID del producto en edición; null si creando
  const [query, setQuery] = useState(''); // Estado: término de búsqueda para filtrar productos

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  }, []);

  const saveProducts = (list) => {
    localStorage.setItem('products', JSON.stringify(list));
    setProducts(list);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (!form.name || isNaN(priceNum) || priceNum < 0) return;

    if (editingId) {
      const updated = products.map((p) =>
        p.id === editingId ? { ...p, ...form, price: priceNum } : p
      );
      saveProducts(updated);
    } else {
      const newProduct = {
        ...form,
        id: Date.now() + Math.random().toString(36).slice(2),
        price: priceNum,
        createdAt: new Date().toISOString(),
      };
      saveProducts([newProduct, ...products]);
    }
    resetForm();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      id: product.id,
      name: product.name || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      description: product.description || '',
      image: product.image || '',
    });
  };

  const remove = (id) => {
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
    if (editingId === id) resetForm();
  };

  const filtered = useMemo(() => {
    return products.filter(
      (p) =>
        !query ||
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Administrar Productos</h1>
        <input
          type="text"
          placeholder="Buscar…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-md px-3 py-2 w-64"
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-4 rounded-md shadow mb-8">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="border rounded-md px-3 py-2 md:col-span-2"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
          type="number"
          step="1"
          className="border rounded-md px-3 py-2"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoría"
          className="border rounded-md px-3 py-2"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="URL Imagen"
          className="border rounded-md px-3 py-2 md:col-span-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="border rounded-md px-3 py-2 md:col-span-6"
          rows={3}
        />
        <div className="md:col-span-6 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {editingId ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border px-4 py-2 rounded-md">
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-left p-3">Precio</th>
              <th className="text-left p-3">Creado</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-600">
                  No hay productos
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{p.category || '-'}</td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-800">Editar</button>
                      <button onClick={() => remove(p.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
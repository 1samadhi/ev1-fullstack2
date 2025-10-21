import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';

const Home = () => {
  const featuredProducts = [
    { id: 'N1', name: 'Razer Blade 16 (2025)', price: 3999990, image: '/images/laptop.svg', category: 'Notebooks' },
    { id: 'N4', name: 'Alienware m18 R2', price: 3599990, image: '/images/laptop.svg', category: 'Notebooks' },
    { id: 'G1', name: 'Even Realities G1', price: 599990, image: '/images/store.svg', category: 'Gafas AR/VR' },
    { id: 'S2', name: 'iPhone 16 Pro Max', price: 1699990, image: '/images/smartphone.svg', category: 'Smartphones' },
  ];

  const features = [
    {
      icon: <Truck size={48} />,
      title: 'Envío Gratis',
      description: 'En compras sobre $30.000'
    },
    {
      icon: <Shield size={48} />,
      title: 'Compra Segura',
      description: 'Protección total en tus pagos'
    },
    {
      icon: <Star size={48} />,
      title: 'Calidad Garantizada',
      description: 'Productos de la mejor calidad'
    },
    {
      icon: <ShoppingBag size={48} />,
      title: 'Fácil Devolución',
      description: 'Devuelve en 30 días'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido a Nuestra Tienda
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Descubre los mejores productos con la mejor calidad y precios increíbles
          </p>
          <Link
            to="/productos"
            className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors inline-block"
          >
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-emerald-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-600 text-lg">
              Descubre nuestros productos más populares
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-sm text-emerald-600 font-medium">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mb-4">
                    {formatPrice(product.price)}
                  </p>
                  <button className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors">
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/productos"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-block"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Suscríbete a Nuestro Newsletter
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Recibe las mejores ofertas y novedades directamente en tu correo
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800"
            />
            <button className="bg-emerald-600 px-6 py-3 rounded-r-lg hover:bg-emerald-700 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
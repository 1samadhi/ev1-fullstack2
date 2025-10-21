import React from 'react';

const Nosotros = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nosotros</h1>
        <p className="text-gray-700 text-lg mb-6">
          Somos <span className="font-semibold">Mr.Robot</span>, una empresa de <span className="font-semibold">Puerto Montt</span>
          enfocada en traer lo último en tecnología. Nuestro compromiso es acercar
          innovaciones y productos de vanguardia con un servicio al cliente de excelencia.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Nuestra Misión</h2>
            <p className="text-gray-700">
              Democratizar el acceso a tecnología moderna, ofreciendo productos confiables y una
              experiencia de compra simple y transparente.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Lo que nos mueve</h2>
            <p className="text-gray-700">
              Innovación constante, cercanía con nuestros clientes y pasión por la tecnología.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
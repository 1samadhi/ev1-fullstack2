import React, { useState } from 'react';

const Contacto = () => {
  const [nombre, setNombre] = useState(''); // Estado: nombre ingresado por el usuario
  const [correo, setCorreo] = useState(''); // Estado: correo electrónico de contacto
  const [mensaje, setMensaje] = useState(''); // Estado: contenido del mensaje enviado
  const [errors, setErrors] = useState({}); // Estado: errores de validación del formulario
  const [sent, setSent] = useState(false); // Estado: marca si el formulario fue enviado correctamente

  const correoContacto = 'contacto@mrrobot.cl';

  const validate = () => {
    const errs = {};

    // Nombre: 3-60 caract., solo letras y espacios
    const nombreTrim = nombre.trim();
    if (nombreTrim.length < 3 || nombreTrim.length > 60) {
      errs.nombre = 'El nombre debe tener entre 3 y 60 caracteres.';
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombreTrim)) {
      errs.nombre = 'El nombre solo puede contener letras y espacios.';
    }

    // Correo: formato válido y longitud
    if (correo) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        errs.correo = 'Formato de correo inválido.';
      } else {
        const domain = correo.split('@')[1];
        if (!domain || domain.length < 3 || domain.length > 30) {
          errs.correo = 'Dominio del correo debe tener entre 3 y 30 caracteres.';
        }
      }
      if (correo.length > 100) {
        errs.correo = 'El correo no debe superar los 100 caracteres.';
      }
    }

    // Mensaje: 10-500 caract.
    const msgTrim = mensaje.trim();
    if (msgTrim.length < 10) {
      errs.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    } else if (msgTrim.length > 500) {
      errs.mensaje = 'El mensaje no debe superar los 500 caracteres.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    if (!validate()) return;
    alert(`Gracias ${nombre}! Te contactaremos pronto al correo ${correo || correoContacto}.`);
    setSent(true);
    setNombre('');
    setCorreo('');
    setMensaje('');
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contacto</h1>
        <p className="text-gray-700 text-lg mb-6">
          Puedes escribirnos directamente a <span className="font-semibold">{correoContacto}</span> o completar el siguiente formulario:
        </p>

        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${errors.nombre ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${errors.correo ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
            />
            {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              className={`w-full border rounded-md px-3 py-2 h-28 focus:outline-none focus:ring-2 ${errors.mensaje ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Cuéntanos en qué te podemos ayudar"
              required
            />
            <div className="flex justify-between">
              {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>}
              <p className="mt-1 text-xs text-gray-500">{mensaje.trim().length}/500</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Enviar
          </button>

          {sent && (
            <div className="mt-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
              ¡Hemos recibido tu mensaje!
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contacto;
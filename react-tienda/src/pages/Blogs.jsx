import React from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blogs y Noticias de IA</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Tendencias, lanzamientos y reseñas del mundo de la inteligencia artificial.
          </p>
        </div>
      </section>

      {/* Blog list */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Post 1 */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
                alt="Trae Solo 2.0"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-emerald-600 font-medium mb-2">Lanzamientos</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Trae Solo 2.0: lo que sabemos hasta ahora</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Trae Solo 2.0 apunta a mejorar la experiencia de desarrollo con asistentes
                  de código más contextuales, acciones automatizadas y un enfoque fuerte en
                  flujos de trabajo reproducibles. Se espera que incorpore integración más
                  profunda con pruebas, revisión de errores y generación de documentación.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  <li>Automatización de tareas del IDE y mayor contexto de repositorio.</li>
                  <li>Mejoras en ejecución de pruebas y depuración guiada.</li>
                  <li>Herramientas para documentación y handoff más confiables.</li>
                </ul>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Publicado: 2025-10-20</span>
                  <span>Lectura: 5 min</span>
                </div>
              </div>
            </article>

            {/* Post 2 */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src="https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg"
                alt="Reseña hackerai.co"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-emerald-600 font-medium mb-2">Reseñas</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Reseña: hackerai.co — comunidad y herramientas para builders</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  hackerai.co destaca por su enfoque en makers y hackers de IA: curaduría de
                  proyectos, herramientas y documentos que aceleran la construcción real de
                  productos. La plataforma fomenta compartir, aprender y colaborar en ideas
                  aplicadas con IA, más allá de demos.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  <li>Recursos prácticos y guías para lanzar proyectos.</li>
                  <li>Comunidad activa con enfoque en calidad y utilidad.</li>
                  <li>Descubrimiento de stacks y patrones listos para producción.</li>
                </ul>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Publicado: 2025-10-20</span>
                  <span>Lectura: 6 min</span>
                </div>
                <div className="mt-4">
                  <a
                    href="https://hackerai.co" target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Visitar hackerai.co
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              to="/contacto"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-block"
            >
              ¿Quieres sugerir una noticia? Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
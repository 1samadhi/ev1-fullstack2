import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">Mr.Robot</span>
            </div>
            <p className="text-gray-300 text-sm">
              Somos Mr.Robot, empresa de Puerto Montt enfocada en traer lo último en tecnología.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ayuda" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/politicas" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Políticas de Devolución
                </Link>
              </li>
              <li>
                <Link to="/envios" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Información de Envíos
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-gray-300" />
                <span className="text-gray-300 text-sm">
                  Puerto Montt, Chile
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-300" />
                <span className="text-gray-300 text-sm">
                  +56 9 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-300" />
                <span className="text-gray-300 text-sm">
                  contacto@mrrobot.cl
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Mr.Robot. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacidad" className="text-gray-300 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors text-sm">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
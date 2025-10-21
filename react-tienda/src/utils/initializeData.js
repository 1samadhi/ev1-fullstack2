// Función para inicializar datos de prueba en localStorage
export const initializeData = () => {
  // Verificar si ya existen datos
  const existingUsers = localStorage.getItem('users');
  const existingProducts = localStorage.getItem('products');
  const existingVersion = localStorage.getItem('catalogVersion');

  // Migración: actualizar emails legacy @tienda.cl a dominios permitidos
  try {
    if (existingUsers) {
      const users = JSON.parse(existingUsers);
      const map = {
        'admin@tienda.cl': 'admin@duoc.cl',
        'usuario@tienda.cl': 'usuario@duoc.cl',
        'vendedor@tienda.cl': 'vendedor@profesor.duoc.cl',
        'usuario@gmail.com': 'usuario@duoc.cl',
      };
      let changed = false;
      const updated = users.map(u => {
        if (map[u.email]) { changed = true; return { ...u, email: map[u.email] }; }
        return u;
      });
      if (changed) {
        localStorage.setItem('users', JSON.stringify(updated));
        const current = localStorage.getItem('currentUser');
        if (current) {
          const cu = JSON.parse(current);
          if (map[cu.email]) {
            cu.email = map[cu.email];
            localStorage.setItem('currentUser', JSON.stringify(cu));
          }
        }
      }
    }
  } catch (e) { /* noop */ }

  // Inicializar usuarios de prueba si no existen
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: '1',
        run: '12345678-9',
        name: 'Admin',
        lastName: 'Sistema',
        email: 'admin@duoc.cl',
        password: 'admin123',
        birthDate: '1990-01-01',
        userType: 'ADMIN',
        region: 'Metropolitana',
        commune: 'Santiago',
        address: 'Av. Principal 123',
        isActive: true,
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        run: '98765432-1',
        name: 'Usuario',
        lastName: 'Prueba',
        email: 'usuario@duoc.cl',
        password: 'user123',
        birthDate: '1995-05-15',
        userType: 'USER',
        region: 'Metropolitana',
        commune: 'Las Condes',
        address: 'Calle Secundaria 456',
        isActive: true,
        role: 'USER',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        run: '11223344-5',
        name: 'Vendedor',
        lastName: 'Prueba',
        email: 'vendedor@profesor.duoc.cl',
        password: 'vend123',
        birthDate: '1992-03-20',
        userType: 'SELLER',
        region: 'Los Lagos',
        commune: 'Puerto Montt',
        address: 'Av. del Mar 789',
        isActive: true,
        role: 'SELLER',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  const CATALOG_VERSION = '2025-10-curated-v1';
  const shouldInitProducts = !existingProducts || existingVersion !== CATALOG_VERSION;
  if (shouldInitProducts) {
    const defaultProducts = [
      // Notebooks
      {
        id: 'N1',
        code: 'NB-RZ-16-2025-4090',
        name: 'Razer Blade 16 (2025)',
        description: 'Intel Core i9-14900HX, RTX 4090, hasta 64GB RAM, UDH+ 120Hz/FHD+ 240Hz.',
        price: 3999990,
        category: 'Notebooks',
        stock: 8,
        criticalStock: 2,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N2',
        code: 'NB-RZ-16-QHD-2025-4080',
        name: 'Razer Blade 16 QHD+ (2025)',
        description: 'Intel Core i9, RTX 4080, 32GB RAM, pantalla 240Hz QHD+.',
        price: 3499990,
        category: 'Notebooks',
        stock: 10,
        criticalStock: 2,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N3',
        code: 'NB-RZ-14-2025-4070',
        name: 'Razer Blade 14 (2025)',
        description: 'AMD Ryzen 9, RTX 4070, portátil compacto y ligero.',
        price: 2799990,
        category: 'Notebooks',
        stock: 12,
        criticalStock: 3,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N4',
        code: 'NB-AW-M18-R2',
        name: 'Alienware m18 R2',
        description: 'Pantalla gigante, opciones Intel/AMD, gráfica RTX serie 40.',
        price: 3599990,
        category: 'Notebooks',
        stock: 7,
        criticalStock: 2,
        status: 'active',
        image: '/images/alienware-m18-r2.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N5',
        code: 'NB-AW-16-A51',
        name: 'Alienware 16 Area-51',
        description: 'Alto rendimiento, configuración avanzada para gamers profesionales.',
        price: 4199990,
        category: 'Notebooks',
        stock: 5,
        criticalStock: 1,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N6',
        code: 'NB-AW-X16-R2',
        name: 'Alienware x16 R2',
        description: 'Diseño ultra delgado y potente, movilidad gamer de última generación.',
        price: 3299990,
        category: 'Notebooks',
        stock: 9,
        criticalStock: 2,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N7',
        code: 'NB-ASUS-G14-2025',
        name: 'ASUS ROG Zephyrus G14 (2025)',
        description: 'Ryzen 9, RTX 4080, portátil ligero para gaming y creación.',
        price: 2899990,
        category: 'Notebooks',
        stock: 11,
        criticalStock: 3,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N8',
        code: 'NB-ASUS-G16-2025',
        name: 'ASUS ROG Zephyrus G16 (2025)',
        description: 'Intel Core i9/Ryzen, RTX 4080, pantalla alta definición.',
        price: 3199990,
        category: 'Notebooks',
        stock: 10,
        criticalStock: 2,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'N9',
        code: 'NB-ASUS-ZENBOOK-DUO-15',
        name: 'ASUS ZenBook Pro Duo 15 OLED',
        description: 'Doble pantalla táctil OLED, Intel Core i9, productividad y diseño.',
        price: 2999990,
        category: 'Notebooks',
        stock: 6,
        criticalStock: 2,
        status: 'active',
        image: '/images/laptop.svg',
        createdAt: new Date().toISOString()
      },

      // Gafas AR/VR
      {
        id: 'G1',
        code: 'AR-EVEN-G1',
        name: 'Even Realities G1',
        description: 'HUD con info en tiempo real y traducción instantánea. IA integrada.',
        price: 599990,
        category: 'Gafas AR/VR',
        stock: 20,
        criticalStock: 5,
        status: 'active',
        image: '/images/store.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'G2',
        code: 'AR-ROKID-MAX',
        name: 'Rokid Max AR',
        description: 'Ligereza 49g, guía de ondas, traducción simultánea en 89 idiomas.',
        price: 399990,
        category: 'Gafas AR/VR',
        stock: 25,
        criticalStock: 6,
        status: 'active',
        image: '/images/store.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'G3',
        code: 'AR-HALO-NOA',
        name: 'Halo (Noa)',
        description: 'Micro pantalla, agente multimodal Noa, audio conducción ósea, 14h uso ligero.',
        price: 699990,
        category: 'Gafas AR/VR',
        stock: 15,
        criticalStock: 4,
        status: 'active',
        image: '/images/store.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'G4',
        code: 'AR-RAYBAN-META-2',
        name: 'Ray-Ban Meta (2ª generación)',
        description: 'Wayfarer con Meta AI, cámara 12MP, video Full HD, control táctil/voz.',
        price: 349990,
        category: 'Gafas AR/VR',
        stock: 30,
        criticalStock: 8,
        status: 'active',
        image: '/images/store.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'G5',
        code: 'AR-OAKLEY-META',
        name: 'Oakley Meta',
        description: 'Estilo deportivo, HUD, cámara alta resolución, Snapdragon AR1 Gen2, IPX4.',
        price: 499990,
        category: 'Gafas AR/VR',
        stock: 18,
        criticalStock: 5,
        status: 'active',
        image: '/images/store.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'G6',
        code: 'AR-XREAL-AIR-2-PRO',
        name: 'Xreal Air 2 Pro',
        description: 'Pantalla virtual enorme, sin cámara/mic, compatibilidad amplia para multimedia.',
        price: 449990,
        category: 'Gafas AR/VR',
        stock: 22,
        criticalStock: 5,
        status: 'active',
        image: '/images/store.svg',
        createdAt: new Date().toISOString()
      },

      // Smartphones
      {
        id: 'S1',
        code: 'SP-SAMSUNG-S25-ULTRA',
        name: 'Samsung Galaxy S25 Ultra',
        description: 'Cámara 200 MP, Zoom óptico x10, IA en fotografía, batería gran rendimiento.',
        price: 1399990,
        category: 'Smartphones',
        stock: 40,
        criticalStock: 10,
        status: 'active',
        image: '/images/smartphone.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'S2',
        code: 'SP-APPLE-IP16PM',
        name: 'iPhone 16 Pro Max',
        description: 'Chip A19, pantalla Pro XDR, cámara mejorada y funciones IA nativas.',
        price: 1699990,
        category: 'Smartphones',
        stock: 35,
        criticalStock: 8,
        status: 'active',
        image: '/images/smartphone.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'S3',
        code: 'SP-GOOGLE-PIXEL-9-PRO',
        name: 'Google Pixel 9 Pro',
        description: 'Procesado de fotografía IA superior, pantalla OLED y rendimiento fluido.',
        price: 1299990,
        category: 'Smartphones',
        stock: 28,
        criticalStock: 7,
        status: 'active',
        image: '/images/smartphone.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'S4',
        code: 'SP-ONEPLUS-13',
        name: 'OnePlus 13',
        description: 'Rendimiento sobresaliente, carga ultra rápida, pantalla AMOLED, sistema ligero.',
        price: 999990,
        category: 'Smartphones',
        stock: 32,
        criticalStock: 8,
        status: 'active',
        image: '/images/smartphone.svg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'S5',
        code: 'SP-XIAOMI-15-ULTRA',
        name: 'Xiaomi 15 Ultra',
        description: 'Calidad-precio con cámaras Leica, batería eficiente y optimización IA.',
        price: 1099990,
        category: 'Smartphones',
        stock: 38,
        criticalStock: 10,
        status: 'active',
        image: '/images/smartphone.svg',
        createdAt: new Date().toISOString()
      },

      // Auriculares
      {
        id: 'A1',
        code: 'AUD-SONY-WH1000XM5',
        name: 'Sony WH-1000XM5',
        description: 'Cancelación de ruido IA, audio de alta calidad y controles táctiles inteligentes.',
        price: 349990,
        category: 'Auriculares',
        stock: 25,
        criticalStock: 5,
        status: 'active',
        image: '/images/headphones-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'A2',
        code: 'AUD-APPLE-AIRPODS-PRO-3',
        name: 'Apple AirPods Pro 3',
        description: 'Adaptación automática de sonido, modo ambiente avanzado y compatibilidad total con iOS.',
        price: 299990,
        category: 'Auriculares',
        stock: 30,
        criticalStock: 8,
        status: 'active',
        image: '/images/headphones-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'A3',
        code: 'AUD-BOSE-QC-ULTRA',
        name: 'Bose QuietComfort Ultra',
        description: 'Comodidad premium, personalización IA de audio y mayor autonomía.',
        price: 329990,
        category: 'Auriculares',
        stock: 20,
        criticalStock: 5,
        status: 'active',
        image: '/images/headphones-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'A4',
        code: 'AUD-SENN-MOMENTUM-4',
        name: 'Sennheiser Momentum 4',
        description: 'Calidad Hi-Fi, bajos potentes, mejora automática por IA según entorno.',
        price: 279990,
        category: 'Auriculares',
        stock: 18,
        criticalStock: 4,
        status: 'active',
        image: '/images/headphones-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'A5',
        code: 'AUD-SAMSUNG-BUDS3-PRO',
        name: 'Samsung Galaxy Buds 3 Pro',
        description: 'IA para optimización del sonido, integración universal con Android y resistencia al agua.',
        price: 249990,
        category: 'Auriculares',
        stock: 40,
        criticalStock: 10,
        status: 'active',
        image: '/images/headphones-real.jpg',
        createdAt: new Date().toISOString()
      },

      // Smartwatches
      {
        id: 'W1',
        code: 'SW-APPLE-ULTRA-2',
        name: 'Apple Watch Ultra 2',
        description: 'Pantalla profesional, sensores de salud avanzados y autonomía destacada.',
        price: 999990,
        category: 'Smartwatches',
        stock: 25,
        criticalStock: 5,
        status: 'active',
        image: '/images/smartwatch-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'W2',
        code: 'SW-SAMSUNG-W6-PRO',
        name: 'Samsung Galaxy Watch6 Pro',
        description: 'GPS preciso, monitoreo avanzado de salud y batería de larga duración.',
        price: 699990,
        category: 'Smartwatches',
        stock: 30,
        criticalStock: 8,
        status: 'active',
        image: '/images/smartwatch-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'W3',
        code: 'SW-HUAWEI-ULTIMATE',
        name: 'Huawei Watch Ultimate',
        description: 'Diseño premium, funciones deportivas y autonomía de más de una semana.',
        price: 649990,
        category: 'Smartwatches',
        stock: 35,
        criticalStock: 8,
        status: 'active',
        image: '/images/smartwatch-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'W4',
        code: 'SW-GARMIN-FENIX-8-PRO',
        name: 'Garmin Fenix 8 Pro',
        description: 'Ideal para deportes extremos, GPS de alta precisión y métricas detalladas.',
        price: 899990,
        category: 'Smartwatches',
        stock: 20,
        criticalStock: 5,
        status: 'active',
        image: '/images/smartwatch-real.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'W5',
        code: 'SW-GOOGLE-PIXEL-WATCH-2',
        name: 'Google Pixel Watch 2',
        description: 'IA personalizada de Google, integración fluida con Android y salud 24/7.',
        price: 599990,
        category: 'Smartwatches',
        stock: 28,
        criticalStock: 7,
        status: 'active',
        image: '/images/smartwatch-real.jpg',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    localStorage.setItem('catalogVersion', CATALOG_VERSION);
  }

  console.log('Datos inicializados correctamente');
};

// Función para obtener regiones y comunas de Chile
export const getRegionsAndCommunes = () => {
  return {
    'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
    'Antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
    'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
    'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
    'Valparaíso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'],
    'Metropolitana': ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'Santiago', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
    "O'Higgins": ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
    'Maule': ['Talca', 'ConstiTución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'RetulerTu', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
    'Ñuble': ['Chillán', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'Chillán Viejo', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'],
    'Biobío': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'],
    'Araucanía': ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
    'Los Ríos': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'],
    'Los Lagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'FruTillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
    'Aysén': ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O\'Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'],
    'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine']
  };
};
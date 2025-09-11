/**
 * Sistema de autenticación y gestión de roles para la Tienda Online
 * Este archivo maneja el inicio de sesión, registro, y control de acceso basado en roles
 */

// Definición de roles y sus permisos
const ROLES = {
    ADMIN: 'administrador',
    VENDEDOR: 'vendedor',
    CLIENTE: 'cliente'
};

// Permisos por rol
const PERMISOS = {
    [ROLES.ADMIN]: [
        'dashboard', 'productos', 'usuarios', 'ordenes', 'reportes', 'empleados', 'configuracion'
    ],
    [ROLES.VENDEDOR]: [
        'productos', 'ordenes'
    ],
    [ROLES.CLIENTE]: [
        'tienda'
    ]
};

// Usuarios de prueba (en una aplicación real, esto estaría en una base de datos)
const USUARIOS = [
    {
        run: '19011022K',
        nombre: 'Admin',
        apellidos: 'Sistema',
        correo: 'admin@duoc.cl',
        password: 'admin123',
        fechaNacimiento: '1990-01-01',
        tipoUsuario: ROLES.ADMIN,
        region: 'Metropolitana',
        comuna: 'Santiago',
        direccion: 'Av. Principal 123'
    },
    {
        run: '12345678K',
        nombre: 'Vendedor',
        apellidos: 'Prueba',
        correo: 'vendedor@duoc.cl',
        password: 'vendedor123',
        fechaNacimiento: '1995-05-15',
        tipoUsuario: ROLES.VENDEDOR,
        region: 'Metropolitana',
        comuna: 'Providencia',
        direccion: 'Calle Comercial 456'
    },
    {
        run: '87654321K',
        nombre: 'Cliente',
        apellidos: 'Regular',
        correo: 'cliente@gmail.com',
        password: 'cliente123',
        fechaNacimiento: '2000-10-20',
        tipoUsuario: ROLES.CLIENTE,
        region: 'Metropolitana',
        comuna: 'Las Condes',
        direccion: 'Pasaje Residencial 789'
    }
];

/**
 * Función para iniciar sesión
 * @param {string} correo - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object|null} - Datos del usuario o null si las credenciales son incorrectas
 */
function iniciarSesion(correo, password) {
    const usuario = USUARIOS.find(u => u.correo === correo && u.password === password);
    
    if (usuario) {
        // Guardar información de sesión en localStorage
        const sesion = {
            run: usuario.run,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            tipoUsuario: usuario.tipoUsuario,
            permisos: PERMISOS[usuario.tipoUsuario]
        };
        
        localStorage.setItem('sesionUsuario', JSON.stringify(sesion));
        return sesion;
    }
    
    return null;
}

/**
 * Función para cerrar sesión
 */
function cerrarSesion() {
    localStorage.removeItem('sesionUsuario');
    window.location.href = 'login.html';
}

/**
 * Función para obtener el usuario actual
 * @returns {Object|null} - Datos del usuario actual o null si no hay sesión
 */
function obtenerUsuarioActual() {
    const sesionData = localStorage.getItem('sesionUsuario');
    return sesionData ? JSON.parse(sesionData) : null;
}

/**
 * Función para verificar si el usuario tiene un permiso específico
 * @param {string} permiso - Permiso a verificar
 * @returns {boolean} - true si tiene permiso, false en caso contrario
 */
function tienePermiso(permiso) {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.permisos && usuario.permisos.includes(permiso);
}

/**
 * Función para verificar si el usuario tiene un rol específico
 * @param {string} rol - Rol a verificar (ADMIN, VENDEDOR, CLIENTE)
 * @returns {boolean} - true si tiene el rol, false en caso contrario
 */
function tieneRol(rol) {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.tipoUsuario === rol;
}

/**
 * Función para proteger páginas según el rol requerido
 * @param {Array} rolesPermitidos - Array de roles que pueden acceder a la página
 */
function protegerPagina(rolesPermitidos) {
    const usuario = obtenerUsuarioActual();
    
    // Si no hay usuario o no tiene un rol permitido, redirigir al login
    if (!usuario || !rolesPermitidos.includes(usuario.tipoUsuario)) {
        window.location.href = 'login.html?acceso_denegado=true';
    }
}

/**
 * Función para validar RUN chileno
 * @param {string} run - RUN a validar (sin puntos ni guión)
 * @returns {boolean} - true si es válido, false en caso contrario
 */
function validarRUN(run) {
    if (!/^[0-9]{7,8}[0-9K]$/.test(run)) {
        return false;
    }
    
    // Algoritmo de validación del dígito verificador
    const runSinDV = run.slice(0, -1);
    const dv = run.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplicador = 2;
    
    // Calcular suma ponderada
    for (let i = runSinDV.length - 1; i >= 0; i--) {
        suma += parseInt(runSinDV.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    // Calcular dígito verificador
    const resto = suma % 11;
    const dvCalculado = 11 - resto;
    
    // Convertir a formato esperado
    let dvEsperado;
    if (dvCalculado === 11) {
        dvEsperado = '0';
    } else if (dvCalculado === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = dvCalculado.toString();
    }
    
    return dv === dvEsperado;
}

/**
 * Función para validar correo electrónico según dominios permitidos
 * @param {string} correo - Correo a validar
 * @returns {boolean} - true si es válido, false en caso contrario
 */
function validarCorreo(correo) {
    // Expresión regular para validar formato de correo
    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    
    if (!formatoValido) {
        return false;
    }
    
    // Validar dominios permitidos
    const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
    const dominio = correo.split('@')[1];
    
    return dominiosPermitidos.includes(dominio);
}

// Exportar funciones para uso en otros archivos
window.Auth = {
    ROLES,
    PERMISOS,
    iniciarSesion,
    cerrarSesion,
    obtenerUsuarioActual,
    tienePermiso,
    tieneRol,
    protegerPagina,
    validarRUN,
    validarCorreo
};
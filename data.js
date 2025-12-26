// ============================================
// SISTEMA DE DATOS CON LOCALSTORAGE - MEJORADO
// ============================================

// Inicializar datos si no existen
function inicializarDatos() {
    // Datos de usuarios
    if (!localStorage.getItem('telepizza_usuarios')) {
        localStorage.setItem('telepizza_usuarios', JSON.stringify([
            { dni: "X0000000X", nombre: "EJEMPLO", puesto: "encargado" } // Cambiado a formato NIE
        ]));
    }
    
    // Datos de registros
    if (!localStorage.getItem('telepizza_registros')) {
        localStorage.setItem('telepizza_registros', JSON.stringify([]));
    }
    
    // Datos de ausencias
    if (!localStorage.getItem('telepizza_ausencias')) {
        localStorage.setItem('telepizza_ausencias', JSON.stringify([]));
    }
    
    // Datos de correo - Establecer correo por defecto
    if (!localStorage.getItem('telepizza_correo')) {
        localStorage.setItem('telepizza_correo', JSON.stringify("fichajetelepizza@outlook.es"));
    }
    
    // Datos de semanas
    if (!localStorage.getItem('telepizza_semanas')) {
        localStorage.setItem('telepizza_semanas', JSON.stringify({}));
    }
    
    // Datos de correos destinatarios (nuevo)
    if (!localStorage.getItem('telepizza_correos_destinatarios')) {
        localStorage.setItem('telepizza_correos_destinatarios', JSON.stringify([]));
    }
}

// Cargar datos
function cargarDatos() {
    return {
        telepizzeros: JSON.parse(localStorage.getItem('telepizza_usuarios')) || [],
        registros: JSON.parse(localStorage.getItem('telepizza_registros')) || [],
        ausencias: JSON.parse(localStorage.getItem('telepizza_ausencias')) || [],
        correoGerencia: JSON.parse(localStorage.getItem('telepizza_correo')) || "fichajetelepizza@outlook.es",
        semanas: JSON.parse(localStorage.getItem('telepizza_semanas')) || {},
        correosDestinatarios: JSON.parse(localStorage.getItem('telepizza_correos_destinatarios')) || []
    };
}

// Guardar datos
function guardarDatos(datos) {
    localStorage.setItem('telepizza_usuarios', JSON.stringify(datos.telepizzeros));
    localStorage.setItem('telepizza_registros', JSON.stringify(datos.registros));
    localStorage.setItem('telepizza_ausencias', JSON.stringify(datos.ausencias));
    localStorage.setItem('telepizza_correo', JSON.stringify(datos.correoGerencia));
    localStorage.setItem('telepizza_semanas', JSON.stringify(datos.semanas));
    localStorage.setItem('telepizza_correos_destinatarios', JSON.stringify(datos.correosDestinatarios || []));
    return true;
}

// Obtener número de semana (ISO 8601)
function obtenerNumeroSemana(fecha) {
    const date = new Date(fecha);
    date.setHours(0, 0, 0, 0);
    
    // ISO 8601: semana comienza el lunes
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    
    return weekNo;
}

// Obtener fecha de inicio y fin de semana
function obtenerRangoSemana(numeroSemana, año) {
    const simple = new Date(año, 0, 1 + (numeroSemana - 1) * 7);
    const dayOfWeek = simple.getDay();
    const startOfWeek = new Date(simple);
    
    // Ajustar para que la semana empiece en lunes
    startOfWeek.setDate(simple.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
        inicio: startOfWeek.toISOString().split('T')[0],
        fin: endOfWeek.toISOString().split('T')[0]
    };
}

// Formatear fecha a DD/MM/YYYY (NUEVO formato)
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
}

// Formatear fecha a YYYY-MM-DD (para inputs)
function formatearFechaInput(fecha) {
    const date = new Date(fecha);
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

// Obtener nombre del puesto
function obtenerNombrePuesto(codigo) {
    const puestos = {
        'auxiliar': 'Auxiliar de Tienda',
        'repartidor': 'Repartidor',
        'encargado': 'Encargado',
        'limpieza': 'Limpieza'
    };
    return puestos[codigo] || codigo;
}

// Obtener clase CSS para puesto
function obtenerClasePuesto(codigo) {
    const clases = {
        'auxiliar': 'puesto-auxiliar',
        'repartidor': 'puesto-repartidor',
        'encargado': 'puesto-encargado',
        'limpieza': 'puesto-limpieza'
    };
    return clases[codigo] || '';
}

// Calcular diferencia de horas entre entrada y salida (soporta días diferentes)
function calcularHorasTrabajadas(fechaEntrada, horaEntrada, fechaSalida, horaSalida) {
    if (!fechaSalida || !horaSalida) return null;
    
    const entrada = new Date(`${fechaEntrada}T${horaEntrada}`);
    const salida = new Date(`${fechaSalida}T${horaSalida}`);
    
    // Si la salida es anterior a la entrada (cruzó medianoche), añadir un día
    if (salida < entrada) {
        salida.setDate(salida.getDate() + 1);
    }
    
    const diffMs = salida - entrada;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { horas: diffHrs, minutos: diffMins, totalMinutos: diffHrs * 60 + diffMins };
}

// Generar resumen semanal mejorado
function generarResumenSemanal(numeroSemana, año) {
    const datos = cargarDatos();
    const registrosSemana = datos.registros.filter(registro => {
        const fecha = new Date(registro.fecha);
        const semanaRegistro = obtenerNumeroSemana(fecha);
        const añoRegistro = fecha.getFullYear();
        return semanaRegistro === numeroSemana && añoRegistro === año;
    });
    
    const rangoSemana = obtenerRangoSemana(numeroSemana, año);
    
    const resumen = {
        numeroSemana,
        año,
        rango: rangoSemana,
        totalRegistros: registrosSemana.length,
        totalEmpleados: new Set(registrosSemana.map(r => r.dni)).size,
        totalHoras: 0,
        porPuesto: {},
        empleados: {},
        registros: registrosSemana
    };
    
    // Calcular horas por empleado y por puesto
    registrosSemana.forEach(registro => {
        if (registro.horasTrabajadas) {
            const tiempo = registro.horasTrabajadas;
            const totalMinutos = tiempo.totalMinutos || 0;
            
            resumen.totalHoras += totalMinutos;
            
            // Por puesto
            if (!resumen.porPuesto[registro.puesto]) {
                resumen.porPuesto[registro.puesto] = {
                    totalMinutos: 0,
                    empleados: new Set()
                };
            }
            resumen.porPuesto[registro.puesto].totalMinutos += totalMinutos;
            resumen.porPuesto[registro.puesto].empleados.add(registro.dni);
            
            // Por empleado
            if (!resumen.empleados[registro.dni]) {
                resumen.empleados[registro.dni] = {
                    nombre: registro.nombre,
                    puesto: registro.puesto,
                    totalMinutos: 0,
                    diasTrabajados: 0,
                    registros: []
                };
            }
            resumen.empleados[registro.dni].totalMinutos += totalMinutos;
            resumen.empleados[registro.dni].diasTrabajados++;
            resumen.empleados[registro.dni].registros.push(registro);
        }
    });
    
    // Convertir minutos a horas y minutos
    resumen.totalHorasTexto = convertirMinutosATexto(resumen.totalHoras);
    
    // Convertir para cada puesto
    Object.keys(resumen.porPuesto).forEach(puesto => {
        resumen.porPuesto[puesto].totalHorasTexto = convertirMinutosATexto(resumen.porPuesto[puesto].totalMinutos);
        resumen.porPuesto[puesto].totalEmpleados = resumen.porPuesto[puesto].empleados.size;
    });
    
    // Convertir para cada empleado
    Object.keys(resumen.empleados).forEach(dni => {
        resumen.empleados[dni].totalHorasTexto = convertirMinutosATexto(resumen.empleados[dni].totalMinutos);
        resumen.empleados[dni].promedioDiario = convertirMinutosATexto(
            Math.round(resumen.empleados[dni].totalMinutos / resumen.empleados[dni].diasTrabajados)
        );
    });
    
    return resumen;
}

// Convertir minutos a texto (ej: 125 => "2h 5m")
function convertirMinutosATexto(minutos) {
    if (!minutos) return "0h 0m";
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
}

// Obtener lista de semanas disponibles mejorada
function obtenerSemanasDisponibles() {
    const datos = cargarDatos();
    const semanasSet = new Set();
    
    datos.registros.forEach(registro => {
        const fecha = new Date(registro.fecha);
        const numeroSemana = obtenerNumeroSemana(fecha);
        const año = fecha.getFullYear();
        semanasSet.add(`${año}-${numeroSemana.toString().padStart(2, '0')}`);
    });
    
    // Ordenar semanas: más reciente primero
    return Array.from(semanasSet).sort((a, b) => {
        const [aAño, aSemana] = a.split('-').map(Number);
        const [bAño, bSemana] = b.split('-').map(Number);
        if (aAño !== bAño) return bAño - aAño;
        return bSemana - aSemana;
    });
}

// Exportar datos para GitHub (simulado)
function exportarDatosParaGitHub() {
    const datos = cargarDatos();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const datosExportar = {
        timestamp,
        totalEmpleados: datos.telepizzeros.length,
        totalRegistros: datos.registros.length,
        totalAusencias: datos.ausencias.length,
        ultimaActualizacion: new Date().toLocaleString('es-ES'),
        datos: datos
    };
    
    // Crear un blob y descargar
    const blob = new Blob([JSON.stringify(datosExportar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telepizza-datos-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return datosExportar;
}

// Importar datos desde archivo
function importarDatosDesdeArchivo(archivo, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);
            
            if (datos.telepizzeros) localStorage.setItem('telepizza_usuarios', JSON.stringify(datos.telepizzeros));
            if (datos.registros) localStorage.setItem('telepizza_registros', JSON.stringify(datos.registros));
            if (datos.ausencias) localStorage.setItem('telepizza_ausencias', JSON.stringify(datos.ausencias));
            if (datos.correoGerencia) localStorage.setItem('telepizza_correo', JSON.stringify(datos.correoGerencia));
            if (datos.correosDestinatarios) localStorage.setItem('telepizza_correos_destinatarios', JSON.stringify(datos.correosDestinatarios));
            
            if (callback) callback(true, "Datos importados correctamente");
        } catch (error) {
            if (callback) callback(false, "Error al importar datos: " + error.message);
        }
    };
    reader.readAsText(archivo);
}

// ============================================
// FUNCIONES DE PERSONALIZACIÓN PARA data.js
// ============================================

// Inicializar datos de personalización
if (!localStorage.getItem('telepizza_personalizacion')) {
    localStorage.setItem('telepizza_personalizacion', JSON.stringify({
        colorFondo: '#D4001C',
        colorSecundario: '#FFC72C',
        colorTexto: '#FFFFFF',
        colorContenedor: '#000000',
        colorBotonesAcceso: '#FFFFFF',
        colorTextoBotonesAcceso: '#D4001C',
        colorBotonFichar: '#4CAF50',
        colorBotonVolver: '#D4001C',
        colorTextoBotonVolver: '#FFFFFF',
        colorBotonSecundario: '#FFC72C',
        logoSize: 150,
        logoOpacity: 15,
        logoPositionX: 50,
        logoPositionY: 50,
        headerHeight: 120,
        headerOpacity: 100,
        containerPadding: 20,
        containerWidth: 100,
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 400,
        fontSize: 16,
        // NUEVAS PROPIEDADES PARA IMÁGENES
        logoFondoURL: 'https://raw.githubusercontent.com/Telepi-0122/fichaje/main/images/telepizza_logo.png',
        headerImageURL: 'https://raw.githubusercontent.com/Telepi-0122/fichaje/main/images/fichaje.png',
        footerLogoURL: 'https://raw.githubusercontent.com/Telepi-0122/fichaje/main/images/telepizza_logo.png'
    }));
}

// Cargar configuración de personalización
function cargarConfiguracionPersonalizacion() {
    try {
        const config = localStorage.getItem('telepizza_personalizacion');
        return config ? JSON.parse(config) : null;
    } catch (e) {
        console.error('Error al cargar configuración de personalización:', e);
        return null;
    }
}

// Guardar configuración de personalización
function guardarConfiguracionPersonalizacion(config) {
    try {
        localStorage.setItem('telepizza_personalizacion', JSON.stringify(config));
        return true;
    } catch (e) {
        console.error('Error al guardar configuración de personalización:', e);
        return false;
    }
}

// ============================================
// FUNCIONES DE PERSONALIZACIÓN DE IMÁGENES
// ============================================

// Función para probar una imagen antes de aplicarla
function probarImagen(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!preview) {
        console.error(`Elemento ${previewId} no encontrado`);
        return;
    }
    
    const img = preview.querySelector('img');
    if (!img) {
        console.error(`Imagen dentro de ${previewId} no encontrada`);
        return;
    }
    
    if (!input.value.trim()) {
        mostrarMensajeImagen("❌ Por favor, introduce una URL de imagen", 'error');
        return;
    }
    
    // Crear una nueva imagen para probar la carga
    const testImg = new Image();
    testImg.onload = function() {
        img.src = input.value;
        img.style.opacity = '1';
        mostrarMensajeImagen("✅ Imagen cargada correctamente", 'success');
        
        // Guardar automáticamente si es una imagen válida
        const config = cargarConfiguracionPersonalizacion();
        if (config) {
            if (inputId === 'logoFondoURL') {
                config.logoFondoURL = input.value;
            } else if (inputId === 'headerImageURL') {
                config.headerImageURL = input.value;
            } else if (inputId === 'footerLogoURL') {
                config.footerLogoURL = input.value;
            }
            guardarConfiguracionPersonalizacion(config);
        }
    };
    
    testImg.onerror = function() {
        mostrarMensajeImagen("❌ Error al cargar la imagen. Verifica la URL", 'error');
        img.style.opacity = '0.3';
    };
    
    testImg.src = input.value;
}

// Función para restaurar una imagen a su valor por defecto
function restaurarImagen(inputId, defaultUrl) {
    const input = document.getElementById(inputId);
    const previewId = 'preview' + inputId.replace('URL', '').charAt(0).toUpperCase() + 
                     inputId.replace('URL', '').slice(1);
    const preview = document.getElementById(previewId);
    
    if (!preview) {
        console.error(`Elemento ${previewId} no encontrado`);
        return;
    }
    
    const img = preview.querySelector('img');
    if (!img) {
        console.error(`Imagen dentro de ${previewId} no encontrada`);
        return;
    }
    
    input.value = defaultUrl;
    img.src = defaultUrl;
    img.style.opacity = '1';
    
    // Actualizar configuración
    const config = cargarConfiguracionPersonalizacion();
    if (config) {
        if (inputId === 'logoFondoURL') {
            config.logoFondoURL = defaultUrl;
        } else if (inputId === 'headerImageURL') {
            config.headerImageURL = defaultUrl;
        } else if (inputId === 'footerLogoURL') {
            config.footerLogoURL = defaultUrl;
        }
        guardarConfiguracionPersonalizacion(config);
    }
    
    mostrarMensajeImagen("✅ Imagen restaurada al valor por defecto", 'success');
}

// Función para mostrar mensajes de imagen
function mostrarMensajeImagen(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensajePersonalizacion');
    if (mensajeDiv) {
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.borderLeftColor = tipo === 'success' ? '#4CAF50' : '#FF5252';
        mensajeDiv.style.display = 'block';
        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.style.display = 'none';
        }, 3000);
    }
}

// Función para aplicar cambios de imágenes
function aplicarCambiosImagenes(config) {
    // Aplicar logo de fondo
    const backgroundLogo = document.getElementById('backgroundLogo');
    if (backgroundLogo && config.logoFondoURL) {
        backgroundLogo.style.backgroundImage = `url('${config.logoFondoURL}')`;
        console.log('Logo de fondo aplicado:', config.logoFondoURL);
    }
    
    // Aplicar imagen de encabezado
    const headerImage = document.getElementById('headerImage');
    if (headerImage && config.headerImageURL) {
        headerImage.src = config.headerImageURL;
        console.log('Imagen de encabezado aplicada:', config.headerImageURL);
    }
    
    // Aplicar logo del pie
    const footerLogo = document.getElementById('footerLogo');
    if (footerLogo && config.footerLogoURL) {
        footerLogo.src = config.footerLogoURL;
        console.log('Logo del pie aplicado:', config.footerLogoURL);
    }
}

// Exportar funciones
window.cargarDatos = cargarDatos;
window.guardarDatos = guardarDatos;
window.obtenerNumeroSemana = obtenerNumeroSemana;
window.obtenerRangoSemana = obtenerRangoSemana;
window.formatearFecha = formatearFecha;
window.formatearFechaInput = formatearFechaInput;
window.obtenerNombrePuesto = obtenerNombrePuesto;
window.obtenerClasePuesto = obtenerClasePuesto;
window.calcularHorasTrabajadas = calcularHorasTrabajadas;
window.generarResumenSemanal = generarResumenSemanal;
window.convertirMinutosATexto = convertirMinutosATexto;
window.obtenerSemanasDisponibles = obtenerSemanasDisponibles;
window.inicializarDatos = inicializarDatos;
window.exportarDatosParaGitHub = exportarDatosParaGitHub;
window.importarDatosDesdeArchivo = importarDatosDesdeArchivo;
window.cargarConfiguracionPersonalizacion = cargarConfiguracionPersonalizacion;
window.guardarConfiguracionPersonalizacion = guardarConfiguracionPersonalizacion;
// Exportar nuevas funciones de imágenes
window.probarImagen = probarImagen;
window.restaurarImagen = restaurarImagen;
window.aplicarCambiosImagenes = aplicarCambiosImagenes;
window.mostrarMensajeImagen = mostrarMensajeImagen;
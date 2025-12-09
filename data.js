// ============================================
// SISTEMA DE DATOS CON LOCALSTORAGE
// ============================================

// Inicializar datos si no existen
function inicializarDatos() {
    // Datos de usuarios
    if (!localStorage.getItem('telepizza_usuarios')) {
        localStorage.setItem('telepizza_usuarios', JSON.stringify([
            { dni: "20086762", nombre: "Noel", puesto: "repartidor" }
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
    
    // Datos de correo
    if (!localStorage.getItem('telepizza_correo')) {
        localStorage.setItem('telepizza_correo', JSON.stringify(null));
    }
    
    // Datos de semanas
    if (!localStorage.getItem('telepizza_semanas')) {
        localStorage.setItem('telepizza_semanas', JSON.stringify({}));
    }
}

// Cargar datos
function cargarDatos() {
    return {
        telepizzeros: JSON.parse(localStorage.getItem('telepizza_usuarios')) || [],
        registros: JSON.parse(localStorage.getItem('telepizza_registros')) || [],
        ausencias: JSON.parse(localStorage.getItem('telepizza_ausencias')) || [],
        correoGerencia: JSON.parse(localStorage.getItem('telepizza_correo')),
        semanas: JSON.parse(localStorage.getItem('telepizza_semanas')) || {}
    };
}

// Guardar datos
function guardarDatos(datos) {
    localStorage.setItem('telepizza_usuarios', JSON.stringify(datos.telepizzeros));
    localStorage.setItem('telepizza_registros', JSON.stringify(datos.registros));
    localStorage.setItem('telepizza_ausencias', JSON.stringify(datos.ausencias));
    localStorage.setItem('telepizza_correo', JSON.stringify(datos.correoGerencia));
    localStorage.setItem('telepizza_semanas', JSON.stringify(datos.semanas));
    return true;
}

// Obtener número de semana
function obtenerNumeroSemana(fecha) {
    const date = new Date(fecha);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
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

// Generar resumen semanal
function generarResumenSemanal(numeroSemana, año) {
    const datos = cargarDatos();
    const registrosSemana = datos.registros.filter(registro => {
        const fecha = new Date(registro.fecha);
        const semanaRegistro = obtenerNumeroSemana(fecha);
        const añoRegistro = fecha.getFullYear();
        return semanaRegistro === numeroSemana && añoRegistro === año;
    });
    
    const resumen = {
        numeroSemana,
        año,
        totalRegistros: registrosSemana.length,
        totalEmpleados: new Set(registrosSemana.map(r => r.dni)).size,
        totalHoras: 0,
        porPuesto: {},
        empleados: {}
    };
    
    // Calcular horas por empleado y por puesto
    registrosSemana.forEach(registro => {
        if (registro.horasTrabajadas) {
            const tiempo = registro.horasTrabajadas;
            const horas = tiempo.horas || 0;
            const minutos = tiempo.minutos || 0;
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
                    diasTrabajados: 0
                };
            }
            resumen.empleados[registro.dni].totalMinutos += totalMinutos;
            resumen.empleados[registro.dni].diasTrabajados++;
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

// Obtener lista de semanas disponibles
function obtenerSemanasDisponibles() {
    const datos = cargarDatos();
    const semanasSet = new Set();
    
    datos.registros.forEach(registro => {
        const fecha = new Date(registro.fecha);
        const numeroSemana = obtenerNumeroSemana(fecha);
        const año = fecha.getFullYear();
        semanasSet.add(`${año}-${numeroSemana}`);
    });
    
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
            
            if (callback) callback(true, "Datos importados correctamente");
        } catch (error) {
            if (callback) callback(false, "Error al importar datos: " + error.message);
        }
    };
    reader.readAsText(archivo);
}
